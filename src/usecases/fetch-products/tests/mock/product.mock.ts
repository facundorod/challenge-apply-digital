import {
  ContentFulApiDTO,
  ContentFulApiItems,
} from '@/domain/dtos/contentFulAPI.dto';
import { Product } from '@/domain/models/product.model';

const mapProductToContentfulApiItem = (
  product: Product,
): ContentFulApiItems => {
  return {
    metadata: {
      tags: [],
    },
    sys: {
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: '9xs1613l9f7v',
        },
      },
      id: `${product.getSku()}`,
      type: 'Entry',
      createdAt: new Date(),
      updatedAt: new Date(),
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      revision: 1,
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'product',
        },
      },
      locale: 'en-US',
    },
    fields: {
      sku: product.getSku(),
      name: product.getName(),
      brand: product.getBrand(),
      model: product.getModel(),
      category: product.getCategory(),
      color: product.getColor(),
      price: product.getPrice(),
      currency: product.getCurrency(),
      stock: product.getStock(),
    },
  };
};

const product1 = new Product({
  sku: 'O53YSHQL',
  name: 'Dell Moto G7',
  brand: 'Dell',
  model: 'Moto G7',
  category: 'Smartphone',
  color: 'Blue',
  price: 1829.92,
  currency: 'USD',
  stock: 75,
});

const product2 = new Product({
  sku: 'UVBY6AR9',
  name: 'Apple Watch Series 7',
  brand: 'Apple',
  model: 'Watch Series 7',
  category: 'Smartwatch',
  color: 'Black',
  price: 133.6,
  currency: 'USD',
  stock: 54,
});

const product3 = new Product({
  sku: 'UEBN4YX5',
  name: 'Samsung iPhone 13',
  brand: 'Samsung',
  model: 'iPhone 13',
  category: 'Smartphone',
  color: 'Green',
  price: 1855.43,
  currency: 'USD',
  stock: 36,
});

const product4 = new Product({
  sku: 'FRGJWMXC',
  name: 'HP QuietComfort 35',
  brand: 'HP',
  model: 'QuietComfort 35',
  category: 'Headphones',
  color: 'Rose Gold',
  price: 806.45,
  currency: 'USD',
  stock: 101,
});

const product5 = new Product({
  sku: 'T7JQPVWB',
  name: 'Acer ZenBook 14',
  brand: 'Acer',
  model: 'ZenBook 14',
  category: 'Laptop',
  color: 'Black',
  price: 125.43,
  currency: 'USD',
  stock: 169,
});

const product6 = new Product({
  sku: 'PUBF8KG9',
  name: 'Samsung Vivoactive 4',
  brand: 'Samsung',
  model: 'Vivoactive 4',
  category: 'Smartwatch',
  color: 'Red',
  price: 713.56,
  currency: 'USD',
  stock: 55,
});

const product7 = new Product({
  sku: 'R4TJ1IVS',
  name: 'Asus HD 450BT',
  brand: 'Asus',
  model: 'HD 450BT',
  category: 'Headphones',
  color: 'Gray',
  price: 1149.82,
  currency: 'USD',
  stock: 23,
});

const product8 = new Product({
  sku: '7I88GSUF',
  name: 'Sony Lumix GH5',
  brand: 'Sony',
  model: 'Lumix GH5',
  category: 'Camera',
  color: 'Rose Gold',
  price: 518.29,
  currency: 'USD',
  stock: 172,
});

const product9 = new Product({
  sku: 'R908CPA7',
  name: 'LG ZenBook 14',
  brand: 'LG',
  model: 'ZenBook 14',
  category: 'Laptop',
  color: 'Purple',
  price: 122.18,
  currency: 'USD',
  stock: 137,
});

const product10 = new Product({
  sku: 'T348VOUG',
  name: 'Panasonic MediaPad M5',
  brand: 'Panasonic',
  model: 'MediaPad M5',
  category: 'Tablet',
  color: 'Blue',
  price: 1044.69,
  currency: 'USD',
  stock: 87,
});

const productsApiMock: ContentFulApiItems[] = [
  mapProductToContentfulApiItem(product1),
  mapProductToContentfulApiItem(product2),
  mapProductToContentfulApiItem(product3),
  mapProductToContentfulApiItem(product4),
  mapProductToContentfulApiItem(product5),
  mapProductToContentfulApiItem(product6),
  mapProductToContentfulApiItem(product7),
  mapProductToContentfulApiItem(product8),
  mapProductToContentfulApiItem(product9),
  mapProductToContentfulApiItem(product10),
];

export const productsMock = [
  product1,
  product2,
  product3,
  product4,
  product5,
  product6,
  product7,
  product8,
  product9,
  product10,
];

export const productsAPIMockResponse: ContentFulApiDTO = {
  items: productsApiMock,
  limit: 10,
  skip: 0,
  sys: {
    type: 'Array',
  },
  total: 5,
};
