import { BaseEntity, DeleteResult, Repository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService<T extends BaseEntity> {
  protected readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async index(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: EntityId): Promise<T> {
    return this.repository.findOne(id as any);
  }

  async findByIds(ids: EntityId[]): Promise<T[]> {
    return this.repository.findByIds(ids);
  }

  async store(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async update(id: EntityId, data: any): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
