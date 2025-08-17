import axios from 'axios'
import { DiaryEntry, NewDiaryEntry } from '../types'

const baseUrl = '/api/diaries'

export const getAll = async (): Promise<DiaryEntry[]> => {
  const { data } = await axios.get<DiaryEntry[]>(baseUrl)
  return data
}

export const create = async (entry: NewDiaryEntry): Promise<DiaryEntry> => {
  const { data } = await axios.post<DiaryEntry>(baseUrl, entry)
  return data
}


