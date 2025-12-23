'use server'

import { supabase } from '@/lib/supabase'

/**
 * Generates a public URL for accessing a question paper from Supabase storage
 * Since the bucket is public, we can use public URLs instead of signed URLs
 * @param filePath - The path to the file in Supabase storage
 * @returns The public URL
 */
export async function getSignedUrl(filePath: string): Promise<string | null> {
  try {
    const { data } = supabase.storage
      .from('question-papers')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Error generating public URL:', error)
    return null
  }
}

/**
 * Uploads a question paper to Supabase storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'branch/semester/subject/year.pdf')
 * @returns The storage path if successful, null otherwise
 */
export async function uploadQuestionPaper(
  file: File,
  path: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('question-papers')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Error uploading file:', error)
      return null
    }

    return data.path
  } catch (error) {
    console.error('Unexpected error:', error)
    return null
  }
}
