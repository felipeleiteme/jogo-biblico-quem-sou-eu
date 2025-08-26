import { NextResponse } from 'next/server';
import { getAllCharacters } from '@/data/bible-characters';

export async function GET() {
  try {
    const characters = getAllCharacters();
    
    return NextResponse.json({
      success: true,
      characters
    });
  } catch (error) {
    console.error('Erro ao obter todos os personagens:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao obter personagens' },
      { status: 500 }
    );
  }
}