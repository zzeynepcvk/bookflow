// src/services/bookApi.ts
export interface ApiBook {
  id: string
  title: string
  author: string
  thumbnail?: string
  pageCount?: number 
}

export async function searchBooks(query: string): Promise<ApiBook[]> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    )
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()

    // items yoksa boş array döndür
    if (!data.items) {
      return []
    }

    return data.items.map((item: any, index: number) => ({
      id: item.id || `api-book-${Date.now()}-${index}`, // ✅ Benzersiz ID oluştur
      title: item.volumeInfo?.title || "Unknown Title",
      author: item.volumeInfo?.authors?.join(", ") || "Unknown Author", 
      thumbnail: item.volumeInfo?.imageLinks?.thumbnail,
      pageCount: item.volumeInfo?.pageCount ?? 0,
    }))
  } catch (error) {
    console.error("❌ searchBooks hatası:", error)
    return []
  }
}