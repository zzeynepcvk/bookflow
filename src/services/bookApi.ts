// src/services/bookApi.ts
export interface ApiBook {
    id: string
    title: string
    author: string
    thumbnail?: string
    pageCount?: number 
  }
  
  export async function searchBooks(query: string): Promise<ApiBook[]> {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    )
    const data = await res.json()
  
    return data.items.map((item: any) => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(", ") || "Unknown",
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        pageCount: item.volumeInfo.pageCount ?? 0,   // ✅ ekle
      }))
      
  }
  