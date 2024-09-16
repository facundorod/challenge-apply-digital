export interface RemoveProductUseCase {
  execute(productSku: string): Promise<void>;
}
