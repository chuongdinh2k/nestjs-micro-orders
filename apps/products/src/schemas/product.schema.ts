import { AbstractDocument } from '@app/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Product extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  thumbnail: string;

  @Prop()
  images: string[];

  @Prop()
  categories: string[];

  @Prop({ default: 0 })
  stock: number;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
