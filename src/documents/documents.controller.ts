import { Controller, Post, Body, UseGuards, Req, Put, Param, Get, Delete, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

// Augment express Request type to include 'user'
declare module 'express' {
  interface Request {
    user?: any;
  }
}

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiOperation({ summary: 'Create a new document' })
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ status: 201, description: 'Document created successfully.' })
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createDocumentDto: CreateDocumentDto, @Req() req: Request) {
    if (req.user) {
      return this.documentsService.create(createDocumentDto, req.user.id);
    }
    throw new Error("User not found in request");
  }

  @ApiOperation({ summary: 'Update a document' })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({ status: 200, description: 'Document updated successfully.' })
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Req() req: Request,
  ) {
    return this.documentsService.update(id, updateDocumentDto, req.user);
  }

  @ApiOperation({ summary: 'Get a document by ID' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully.' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.documentsService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully.' })
  @Get()
  async findAll(@Req() req: Request) {
    return this.documentsService.findAll(req.user);
  }

  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully.' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.documentsService.remove(id, req.user);
  }
}
