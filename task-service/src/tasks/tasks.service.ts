import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async findAll(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const newTask = new this.taskModel({
      ...createTaskDto,
      userId,
      status: createTaskDto.status || TaskStatus.TODO,
    });
    return newTask.save();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const updatedTask = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, updateTaskDto, { new: true })
      .exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
