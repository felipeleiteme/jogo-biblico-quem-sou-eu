import { NextRequest, NextResponse } from 'next/server';
import { getCharacterById } from '@/data/bible-characters';

export async function POST(request: NextRequest) {
  try {
    const { characterId, guess } = await request.json();
    
    if (!characterId || !guess) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    const character = getCharacterById(parseInt(characterId));
    
    if (!character) {
      return NextResponse.json(
        { success: false, error: 'Personagem não encontrado' },
        { status: 404 }
      );
    }
    
    const isCorrect = guess.trim().toLowerCase() === character.name.toLowerCase();
    
    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: character.name
    });
  } catch (error) {
    console.error('Erro ao verificar resposta:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao verificar resposta' },
      { status: 500 }
    );
  }
}