import { NextRequest, NextResponse } from 'next/server';
import { getRandomCharacter } from '@/data/bible-characters';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exclude = searchParams.get('exclude');
    
    let character = getRandomCharacter();
    
    // Se houver IDs para excluir, tenta encontrar um personagem diferente
    if (exclude) {
      const excludeIds = exclude.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      let attempts = 0;
      
      while (excludeIds.includes(character.id) && attempts < 100) {
        character = getRandomCharacter();
        attempts++;
      }
    }
    
    return NextResponse.json({
      success: true,
      character
    });
  } catch (error) {
    console.error('Erro ao obter personagem aleatório:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao obter personagem aleatório' },
      { status: 500 }
    );
  }
}