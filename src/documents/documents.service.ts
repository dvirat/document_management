import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Document } from './entity/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UserRole } from '../users/entity/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly dataSource: DataSource,
  ) {}

  // Create a new document
  async create(createDocumentDto: CreateDocumentDto, ownerId: number): Promise<Document> {
    const doc = this.documentRepository.create({
      ...createDocumentDto,
      owner: { id: ownerId },
    });
    return this.documentRepository.save(doc);
  }

  // Update a document
  async update(id: number, updateDocumentDto: UpdateDocumentDto, user: any): Promise<Document> {
    return this.dataSource.transaction(async manager => {
      const doc = await manager.findOne(Document, {
        where: { id },
        relations: ['owner'],
      });
      if (!doc) throw new NotFoundException('Document not found');
      if (user.role !== UserRole.ADMIN && doc.owner.id !== user.id) {
        throw new ForbiddenException('You are not allowed to edit this document');
      }
      Object.assign(doc, updateDocumentDto);
      return manager.save(doc);
    });
  }

  // Find one document by id
  async findOne(id: number, user: any): Promise<Document> {
    const doc = await this.documentRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!doc) throw new NotFoundException('Document not found');
    if (user.role !== UserRole.ADMIN && doc.owner.id !== user.id) {
      throw new ForbiddenException('You are not allowed to view this document');
    }
    return doc;
  }

  // List all documents (admins see all, users see their own)
  async findAll(user: any): Promise<Document[]> {
    if (user.role === UserRole.ADMIN) {
      return this.documentRepository.find({ relations: ['owner'] });
    }
    return this.documentRepository.find({
      where: { owner: { id: user.id } },
      relations: ['owner'],
    });
  }

  // Delete a document (admin only)
  async remove(id: number, user: any): Promise<void> {
    const doc = await this.documentRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!doc) throw new NotFoundException('Document not found');
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete documents');
    }
    await this.documentRepository.remove(doc);
  }
}
