'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BibleCharacter, GameHint, GameState } from '@/types/bible-characters';
import { getRandomCharacter } from '@/data/bible-characters';

const BibleGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentCharacter: null,
    hintsRevealed: [],
    score: 0,
    totalRounds: 100,
    currentRound: 1,
    gameStatus: 'waiting',
    lastGuess: '',
    lastGuessCorrect: false,
    availableCharacters: []
  });

  const [userGuess, setUserGuess] = useState('');
  const [usedCharacters, setUsedCharacters] = useState<number[]>([]);

  const startNewGame = () => {
    setGameState({
      currentCharacter: null,
      hintsRevealed: [],
      score: 0,
      totalRounds: 100,
      currentRound: 1,
      gameStatus: 'playing',
      lastGuess: '',
      lastGuessCorrect: false,
      availableCharacters: []
    });
    setUsedCharacters([]);
    setUserGuess('');
    startNewRound();
  };

  const startNewGameWithNewCharacters = () => {
    setGameState({
      currentCharacter: null,
      hintsRevealed: [],
      score: 0,
      totalRounds: 100,
      currentRound: 1,
      gameStatus: 'waiting',
      lastGuess: '',
      lastGuessCorrect: false,
      availableCharacters: []
    });
    setUserGuess('');
    startNewRound();
  };

  const startNewRound = () => {
    // Selecionar um personagem aleatório que ainda não foi usado
    let newCharacter: BibleCharacter;
    let attempts = 0;
    
    // Se já usamos todos os 100 personagens, resetar
    if (usedCharacters.length >= 100) {
      setUsedCharacters([]);
    }
    
    // Encontrar um personagem não usado
    do {
      newCharacter = getRandomCharacter();
      attempts++;
    } while (usedCharacters.includes(newCharacter.id) && attempts < 100);

    if (attempts >= 100) {
      // Se não conseguir encontrar um personagem não usado, limpar a lista
      setUsedCharacters([]);
      newCharacter = getRandomCharacter();
    }

    // Marcar o personagem como usado
    setUsedCharacters(prev => [...prev, newCharacter.id]);
    
    // Obter a primeira pista (mais difícil) automaticamente
    const availableHints = getAvailableHints(newCharacter);
    const firstHint = availableHints[0];
    
    setGameState(prev => ({
      ...prev,
      currentCharacter: newCharacter,
      hintsRevealed: [firstHint],
      gameStatus: 'playing',
      lastGuess: '',
      lastGuessCorrect: false,
      availableCharacters: [newCharacter] // Apenas o personagem atual
    }));
    setUserGuess('');
  };

  const getAvailableHints = (character: BibleCharacter): GameHint[] => {
    // Primeiras três pistas fixas
    const hints: GameHint[] = [
      { type: 'mainCharacteristic', text: character.mainCharacteristic, difficulty: 5 },
    ];

    // Adicionar Qualidade Central como segunda pista se existir
    if (character.centralQuality) {
      hints.push({ type: 'centralQuality', text: character.centralQuality, difficulty: 4 });
    }

    // Adicionar Curiosidade como terceira pista
    hints.push({ type: 'curiosity', text: character.curiosity, difficulty: 2 });

    // Demais pistas
    if (character.symbol) {
      hints.push({ type: 'symbol', text: character.symbol, difficulty: 3 });
    }
    if (character.crossroads) {
      hints.push({ type: 'crossroads', text: character.crossroads, difficulty: 3 });
    }
    if (character.contrast) {
      hints.push({ type: 'contrast', text: character.contrast, difficulty: 3 });
    }
    hints.push({ type: 'spiritualJewel', text: character.spiritualJewel, difficulty: 4 });
    hints.push({ type: 'practicalLesson', text: character.practicalLesson, difficulty: 3 });

    return hints;
  };

  const revealNextHint = () => {
    if (!gameState.currentCharacter || gameState.gameStatus !== 'playing') return;

    const availableHints = getAvailableHints(gameState.currentCharacter);
    const revealedTypes = gameState.hintsRevealed.map(h => h.type);
    const nextHint = availableHints.find(h => !revealedTypes.includes(h.type));

    if (nextHint) {
      setGameState(prev => ({
        ...prev,
        hintsRevealed: [...prev.hintsRevealed, nextHint]
      }));
    }
  };

  const checkGuess = () => {
    if (!gameState.currentCharacter || !userGuess.trim()) return;

    // Função para remover acentos e caracteres especiais
    const normalizeString = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD') // Decompõe caracteres acentuados em caracteres base + acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .replace(/[^a-z0-9\s]/g, '') // Remove caracteres não alfanuméricos (exceto espaços)
        .trim();
    };

    const userGuessLower = normalizeString(userGuess);
    const characterNameLower = normalizeString(gameState.currentCharacter.name);
    
    // Verificar se o nome do personagem está contido na resposta do usuário
    // ou se a resposta do usuário está contida no nome do personagem
    const isCorrect = characterNameLower.includes(userGuessLower) || userGuessLower.includes(characterNameLower);
    
    const points = Math.max(1, 6 - gameState.hintsRevealed.length);
    
    setGameState(prev => ({
      ...prev,
      lastGuess: userGuess,
      lastGuessCorrect: isCorrect,
      score: isCorrect ? prev.score + points : prev.score,
      gameStatus: 'finished'
    }));

    setUserGuess('');
  };

  const skipCharacter = () => {
    if (!gameState.currentCharacter) return;

    setGameState(prev => ({
      ...prev,
      lastGuess: '',
      lastGuessCorrect: false,
      gameStatus: 'finished'
    }));
    setUserGuess('');
  };

  const nextRound = () => {
    if (gameState.currentRound >= gameState.totalRounds) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'waiting'
      }));
    } else if (gameState.currentRound === gameState.totalRounds - 1) {
      // Se for a última rodada (rodada 4 de 5), ir diretamente para a tela final
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        gameStatus: 'waiting'
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        gameStatus: 'playing'
      }));
      startNewRound();
    }
  };

  const getHintTypeName = (type: string) => {
    const typeNames: { [key: string]: string } = {
      mainCharacteristic: 'Característica Principal',
      centralQuality: 'Qualidade Central',
      symbol: 'Símbolo',
      crossroads: 'Encruzilhada',
      contrast: 'Contraste',
      curiosity: 'Curiosidade',
      spiritualJewel: 'Joia Espiritual',
      practicalLesson: 'Lição Prática'
    };
    return typeNames[type] || type;
  };

  const getHintDifficultyColor = (difficulty: number) => {
    if (difficulty >= 5) return 'bg-red-100 text-red-800';
    if (difficulty >= 4) return 'bg-orange-100 text-orange-800';
    if (difficulty >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const progressPercentage = (gameState.currentRound / gameState.totalRounds) * 100;

  if (gameState.gameStatus === 'waiting' && gameState.currentRound === 1) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">Quem Sou Eu?</CardTitle>
            <CardDescription className="text-lg">
              Jogo Bíblico - Descubra o personagem com base nas pistas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-left space-y-4 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold">Como Jogar:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>O jogo mostrará pistas sobre um personagem bíblico</li>
                <li>A primeira pista (mais difícil) é revelada automaticamente</li>
                <li>As pistas seguintes vão das mais difíceis para as mais fáceis</li>
                <li>Tente adivinhar o personagem com o menor número de pistas possível</li>
                <li>Quando todas as pistas forem reveladas, o nome do personagem será mostrado</li>
                <li>Quanto menos pistas você usar, mais pontos você ganha</li>
                <li>O jogo tem {gameState.totalRounds} rodadas no total</li>
              </ul>
            </div>
            <Button onClick={startNewGame} size="lg" className="text-lg px-8">
              Começar Jogo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState.gameStatus === 'waiting' && gameState.currentRound >= gameState.totalRounds) {
    const maxPossibleScore = gameState.totalRounds * 5; // Máximo de 5 pontos por rodada
    const performancePercentage = Math.round((gameState.score / maxPossibleScore) * 100);
    
    let performanceMessage = "";
    let performanceColor = "";
    
    if (performancePercentage >= 80) {
      performanceMessage = "Excelente! Você é um expert em personagens bíblicos!";
      performanceColor = "text-green-600";
    } else if (performancePercentage >= 60) {
      performanceMessage = "Muito bom! Você conhece bem a Bíblia!";
      performanceColor = "text-blue-600";
    } else if (performancePercentage >= 40) {
      performanceMessage = "Bom trabalho! Continue estudando as Escrituras!";
      performanceColor = "text-orange-600";
    } else {
      performanceMessage = "Continue praticando! A Bíblia está cheia de personagens fascinantes!";
      performanceColor = "text-purple-600";
    }

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">🎉 Jogo Finalizado!</CardTitle>
            <CardDescription className="text-lg">
              Parabéns por completar todas as {gameState.totalRounds} rodadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pontuação Final */}
            <div className="space-y-2">
              <div className="text-6xl font-bold text-primary">
                {gameState.score} pontos
              </div>
              <div className="text-lg text-muted-foreground">
                de {maxPossibleScore} pontos possíveis
              </div>
              <div className="text-2xl font-semibold">
                <span className={performanceColor}>
                  {performancePercentage}%
                </span>
              </div>
            </div>

            {/* Mensagem de Desempenho */}
            <div className={`text-lg ${performanceColor} font-medium`}>
              {performanceMessage}
            </div>

            {/* Estatísticas */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Estatísticas da Partida:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Total de Rodadas</div>
                  <div className="text-2xl font-bold text-primary">{gameState.totalRounds}</div>
                </div>
                <div>
                  <div className="font-medium">Média por Rodada</div>
                  <div className="text-2xl font-bold text-primary">
                    {(gameState.score / gameState.totalRounds).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              {gameState.score === 0 ? (
                <>
                  {/* Mensagem especial para pontuação 0 */}
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      😔 Não desista!
                    </h3>
                    <p className="text-red-700">
                      Todos começam em algum lugar. Tente novamente e melhore seu conhecimento dos personagens bíblicos!
                    </p>
                  </div>
                  
                  <Button 
                    onClick={startNewGame} 
                    size="lg" 
                    className="w-full text-lg px-8 bg-red-600 hover:bg-red-700"
                  >
                    🚀 Tentar Novamente
                  </Button>
                  
                  <Button 
                    onClick={startNewGameWithNewCharacters} 
                    variant="outline" 
                    size="lg" 
                    className="w-full text-lg px-8"
                  >
                    🔄 Jogar com Personagens Diferentes
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={startNewGameWithNewCharacters} 
                    size="lg" 
                    className="w-full text-lg px-8"
                  >
                    🔄 Jogar Novamente com Personagens Diferentes
                  </Button>
                  <Button 
                    onClick={startNewGame} 
                    variant="outline" 
                    size="lg" 
                    className="w-full text-lg px-8"
                  >
                    🎮 Começar Novo Jogo (pode repetir personagens)
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Game Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Quem Sou Eu?</CardTitle>
              <CardDescription>Jogo Bíblico - Rodada {gameState.currentRound} de {gameState.totalRounds}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{gameState.score}</div>
              <div className="text-sm text-muted-foreground">pontos</div>
            </div>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </CardHeader>
      </Card>

      {/* Game Content */}
      {gameState.currentCharacter && (
        <>
          {/* Hints Section */}
          <Card>
            <CardHeader>
              <CardTitle>Pistas Reveladas</CardTitle>
              <CardDescription>
                {gameState.hintsRevealed.length === 1 
                  ? "Primeira pista revelada! Clique para mais pistas" 
                  : `${gameState.hintsRevealed.length} pista(s) revelada(s)`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gameState.hintsRevealed.map((hint, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getHintDifficultyColor(hint.difficulty)}>
                      Dificuldade: {hint.difficulty}/5
                    </Badge>
                    <Badge variant="outline">
                      {getHintTypeName(hint.type)}
                    </Badge>
                  </div>
                  <p className="text-lg leading-relaxed p-4 bg-muted rounded-lg">
                    {hint.text}
                  </p>
                </div>
              ))}
              
              {/* Mostrar nome do personagem quando todas as pistas forem reveladas */}
              {gameState.gameStatus === 'playing' && gameState.hintsRevealed.length >= getAvailableHints(gameState.currentCharacter).length && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Todas as pistas foram reveladas!</h3>
                    <p className="text-blue-700 mb-3">O personagem é:</p>
                    <div className="text-2xl font-bold text-blue-900 bg-white p-3 rounded border-2 border-blue-300">
                      {gameState.currentCharacter?.name}
                    </div>
                  </div>
                </div>
              )}
              
              {gameState.gameStatus === 'playing' && (
                <div className="space-y-3">
                  <Button 
                    onClick={revealNextHint} 
                    className="w-full"
                    disabled={gameState.hintsRevealed.length >= getAvailableHints(gameState.currentCharacter).length}
                  >
                    Revelar Próxima Pista
                  </Button>
                  
                  {gameState.hintsRevealed.length >= getAvailableHints(gameState.currentCharacter).length && (
                    <Button 
                      onClick={skipCharacter} 
                      variant="outline"
                      className="w-full"
                    >
                      Próximo Personagem
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guess Section - Só aparece se ainda houver pistas não reveladas */}
          {gameState.gameStatus === 'playing' && gameState.hintsRevealed.length < getAvailableHints(gameState.currentCharacter).length && (
            <Card>
              <CardHeader>
                <CardTitle>Qual é o personagem?</CardTitle>
                <CardDescription>
                  Digite o nome do personagem bíblico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Digite o nome do personagem..."
                    onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
                  />
                  <Button onClick={checkGuess} disabled={!userGuess.trim()}>
                    Verificar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result Section */}
          {gameState.gameStatus === 'finished' && (
            <Card>
              <CardHeader>
                <CardTitle className={gameState.lastGuessCorrect ? "text-green-600" : gameState.lastGuess ? "text-red-600" : "text-orange-600"}>
                  {gameState.lastGuessCorrect ? "Resposta Correta!" : gameState.lastGuess ? "Resposta Incorreta!" : "Personagem Pulado!"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className={gameState.lastGuessCorrect ? "border-green-200 bg-green-50" : gameState.lastGuess ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}>
                  <AlertDescription>
                    {gameState.lastGuessCorrect ? (
                      <span>
                        Parabéns! Você acertou o personagem <strong>{gameState.currentCharacter?.name}</strong> 
                        com {gameState.hintsRevealed.length} pista(s) e ganhou {Math.max(1, 6 - gameState.hintsRevealed.length)} ponto(s)!
                      </span>
                    ) : gameState.lastGuess ? (
                      <span>
                        A resposta correta era <strong>{gameState.currentCharacter?.name}</strong>. 
                        Sua resposta foi "{gameState.lastGuess}".
                      </span>
                    ) : (
                      <span>
                        Você pulou o personagem. A resposta correta era <strong>{gameState.currentCharacter?.name}</strong>.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
                
                <div className="text-center">
                  <Button onClick={nextRound} size="lg">
                    {gameState.currentRound >= gameState.totalRounds - 1 ? "Ver Placar Final" : "Próxima Rodada"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default BibleGame;