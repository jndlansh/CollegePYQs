'use server'

import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function uploadQuestionPaper(formData: FormData) {
  try {
    const file = formData.get('file') as File
    const subjectId = formData.get('subjectId') as string
    const year = parseInt(formData.get('year') as string)
    const branchSlug = formData.get('branchSlug') as string
    const semester = formData.get('semester') as string

    if (!file || !subjectId || !year || !branchSlug || !semester) {
      return { success: false, error: 'Missing required fields' }
    }

    // Get subject details for file naming
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    })

    if (!subject) {
      return { success: false, error: 'Subject not found' }
    }

    // Create file path: branch/semX/SUBJECTCODE_YEAR.pdf
    const fileName = `${subject.code}_${year}.pdf`
    const filePath = `${branchSlug}/sem${semester}/${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('question-papers')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: true, // Replace if exists
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return { success: false, error: `Upload failed: ${uploadError.message}` }
    }

    // Create database record
    const questionPaper = await prisma.questionPaper.create({
      data: {
        year,
        fileUrl: filePath,
        subjectId,
      },
    })

    return {
      success: true,
      data: {
        id: questionPaper.id,
        filePath,
      },
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
