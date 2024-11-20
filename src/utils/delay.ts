export async function delay(delay: number = 1): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay * 1000))
}
