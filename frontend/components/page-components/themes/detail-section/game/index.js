import React, { useEffect, useCallback, useReducer, useMemo } from 'react'
import styles from './game.module.css'

const cardImages = [
  '/game/01.png',
  '/game/02.png',
  '/game/03.png',
  '/game/04.png',
  '/game/05.png',
  '/game/06.png',
]
const cardBackImage = '/game/card.jpg'

const objectToFind = { name: '鑰匙鬼鬼', image: '/game/key.png' }

const balloonPositions = [
  { x: '26%', y: '14%' },
  { x: '31.8%', y: '84.5%' },
  { x: '66%', y: '20%' },
  { x: '71%', y: '82%' },
  { x: '79%', y: '51%' },
]

const riddles = [
  { question: '什麼東西在桌上可以看到，卻永遠無法使用？', answer: '影子' },
  { question: '每一天都帶來光明和溫暖，但你永遠無法直視他？', answer: '太陽' },
  { question: '什麼東西能打開所有鎖，但自己卻永遠關不上？', answer: '鑰匙' },
]

const initialState = {
  gameStarted: false,
  currentTab: 1,
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  foundDifferences: [],
  solvedRiddles: 0,
  isProcessing: false,
  message: '',
  showLevelComplete: [false, false, false],
  gameCompleted: false,
}

const reducer = (state, action) => {
  const ensureArrays = (newState) => ({
    ...newState,
    foundDifferences: Array.isArray(newState.foundDifferences)
      ? newState.foundDifferences
      : [],
  })

  switch (action.type) {
    case 'START_GAME':
      return ensureArrays({ ...state, gameStarted: true })
    case 'INIT_LEVEL1':
      return ensureArrays({
        ...state,
        cards: action.payload,
        matchedPairs: 0,
        flippedCards: [],
      })
    case 'FLIP_CARD':
      return ensureArrays({
        ...state,
        cards: action.payload.cards,
        flippedCards: action.payload.flippedCards,
        isProcessing: action.payload.flippedCards.length === 2,
      })
    case 'MATCH_PAIR':
      return ensureArrays({
        ...state,
        matchedPairs: state.matchedPairs + 1,
        flippedCards: [],
        isProcessing: false,
      })
    case 'NO_MATCH':
      return ensureArrays({
        ...state,
        cards: action.payload,
        flippedCards: [],
        isProcessing: false,
      })
    case 'FOUND_DIFFERENCE':
      return ensureArrays({
        ...state,
        foundDifferences: [...(state.foundDifferences || []), action.payload],
      })
    case 'SOLVE_RIDDLE':
      return ensureArrays({
        ...state,
        solvedRiddles: state.solvedRiddles + 1,
      })
    case 'SET_MESSAGE':
      return ensureArrays({ ...state, message: action.payload })
    case 'SHOW_LEVEL_COMPLETE': {
      const newShowLevelComplete = [...state.showLevelComplete]
      newShowLevelComplete[state.currentTab - 1] = true
      return ensureArrays({ ...state, showLevelComplete: newShowLevelComplete })
    }
    case 'HIDE_LEVEL_COMPLETE': {
      const updatedShowLevelComplete = [...state.showLevelComplete]
      updatedShowLevelComplete[action.payload - 1] = false
      return ensureArrays({
        ...state,
        showLevelComplete: updatedShowLevelComplete,
      })
    }
    case 'COMPLETE_GAME':
      return ensureArrays({ ...state, gameCompleted: true })
    case 'RESET_LEVEL2':
      return ensureArrays({
        ...state,
        foundDifferences: [],
      })
    case 'CHANGE_TAB':
      return ensureArrays({ ...state, currentTab: action.payload })
    default:
      return ensureArrays(state)
  }
}

const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const Card = React.memo(({ card, onClick, index }) => (
  <div
    className={`${styles.card} ${card.flipped ? styles.cardFlipped : ''}`}
    onClick={onClick}
    onKeyPress={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick()
      }
    }}
    style={{ '--rotation': card.flipped ? '180deg' : '0deg' }}
    role="button"
    tabIndex="0"
    aria-label={`Card ${index + 1}${card.flipped ? ', flipped' : ''}`}
  >
    <div className={styles.cardInner}>
      <div
        className={`${styles.cardFace} ${styles.cardFront}`}
        style={{ backgroundImage: `url(${card.image})` }}
      />
      <div
        className={`${styles.cardFace} ${styles.cardBack}`}
        style={{ backgroundImage: `url(${cardBackImage})` }}
      />
    </div>
  </div>
))

Card.displayName = 'Card'

export default function Game() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (
      state.gameStarted &&
      state.currentTab === 1 &&
      state.cards.length === 0
    ) {
      const shuffledCards = shuffleArray([...cardImages, ...cardImages])
      const cards = shuffledCards.map((image, index) => ({
        image,
        index,
        flipped: false,
      }))
      dispatch({ type: 'INIT_LEVEL1', payload: cards })
    } else if (state.currentTab === 2) {
      dispatch({ type: 'RESET_LEVEL2' })
    }
  }, [state.gameStarted, state.currentTab, state.cards.length])

  const checkMatch = useCallback(
    (flippedPair) => {
      const [card1, card2] = flippedPair
      if (card1.image === card2.image) {
        dispatch({ type: 'MATCH_PAIR' })
        if (state.matchedPairs + 1 === 6) {
          dispatch({ type: 'SHOW_LEVEL_COMPLETE' })
        }
      } else {
        setTimeout(() => {
          const newCards = [...state.cards]
          newCards[card1.index].flipped = false
          newCards[card2.index].flipped = false
          dispatch({ type: 'NO_MATCH', payload: newCards })
        }, 500)
      }
    },
    [state.cards, state.matchedPairs]
  )

  const flipCard = useCallback(
    (index) => {
      if (
        state.isProcessing ||
        state.flippedCards.length >= 2 ||
        state.cards[index].flipped
      )
        return

      const newCards = [...state.cards]
      newCards[index].flipped = true
      const newFlippedCards = [
        ...state.flippedCards,
        { ...newCards[index], index },
      ]

      dispatch({
        type: 'FLIP_CARD',
        payload: { cards: newCards, flippedCards: newFlippedCards },
      })

      if (newFlippedCards.length === 2) {
        setTimeout(() => checkMatch(newFlippedCards), 300)
      }
    },
    [state.cards, state.flippedCards, state.isProcessing, checkMatch]
  )

  const handleDifferenceClick = useCallback(
    (index) => {
      if (!state.foundDifferences.includes(index)) {
        dispatch({ type: 'FOUND_DIFFERENCE', payload: index })
        if (state.foundDifferences.length + 1 === balloonPositions.length) {
          dispatch({ type: 'SHOW_LEVEL_COMPLETE' })
        }
      }
      dispatch({ type: 'SET_MESSAGE', payload: '' })
    },
    [state.foundDifferences]
  )

  const checkAnswer = useCallback(
    (index, userAnswer) => {
      if (userAnswer.toLowerCase() === riddles[index].answer.toLowerCase()) {
        dispatch({ type: 'SET_MESSAGE', payload: '回答正確！' })
        dispatch({ type: 'SOLVE_RIDDLE' })
        if (state.solvedRiddles + 1 === riddles.length) {
          setTimeout(() => {
            dispatch({ type: 'SHOW_LEVEL_COMPLETE' })
          }, 500)
        } else {
          setTimeout(() => {
            dispatch({ type: 'SET_MESSAGE', payload: '' })
          }, 1000)
        }
      } else {
        dispatch({ type: 'SET_MESSAGE', payload: '回答錯誤，請再試一次。' })
        setTimeout(() => {
          dispatch({ type: 'SET_MESSAGE', payload: '' })
        }, 1000)
      }
    },
    [state.solvedRiddles]
  )

  const handleTabChange = useCallback((tabIndex) => {
    dispatch({ type: 'CHANGE_TAB', payload: tabIndex })
  }, [])

  const cardElements = useMemo(
    () =>
      state.cards.map((card, index) => (
        <Card key={index} card={card} onClick={() => flipCard(index)} />
      )),
    [state.cards, flipCard]
  )

  const IntroScreen = () => (
    <div className="container">
      <h1 className={styles.title}>\密室逃脫小遊戲/</h1>
      <div className={styles.introScreen}>
        <img src="/game/intro.png" alt="Intro" className={styles.introImage} />
        <p className={styles.p}>
          在前往密室逃脫前，玩個小遊戲，
          <br />
          準備好挑戰你的觀察力和智慧了嗎？
        </p>
        <button
          className={styles.startButton}
          onClick={() => dispatch({ type: 'START_GAME' })}
        >
          開始遊戲
        </button>
      </div>
    </div>
  )

  const LevelCompleteScreen = ({ level }) => (
    <div className={styles.levelCompleteScreen}>
      <h2 className={styles.title2}>恭喜完成第{level}關！</h2>
      <div>
        <img
          src={`/game/complete${level}.png`}
          alt={`Level ${level} Complete`}
          className={styles.levelCompleteImage}
        />
      </div>
      <button
        className={styles.nextLevelButton}
        onClick={() =>
          dispatch({ type: 'HIDE_LEVEL_COMPLETE', payload: level })
        }
      >
        返回遊戲
      </button>
    </div>
  )

  const GameCompletedScreen = () => (
    <div className={styles.gameCompletedScreen}>
      <h2>恭喜你完成所有關卡！</h2>
      <div className="mt-4">
        <img
          src="/game/complete3.png"
          alt="Game Completed"
          className={styles.gameCompletedImage}
        />
      </div>
      <p>你成功逃出密室了！</p>
    </div>
  )

  const GameContent = () => (
    <div className={styles.gameContent}>
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {[1, 2, 3].map((tabIndex, index) => (
            <React.Fragment key={tabIndex}>
              <button
                onClick={() => handleTabChange(tabIndex)}
                className={`${styles.tabButton} ${
                  state.currentTab === tabIndex ? styles.activeTab : ''
                }`}
              >
                {tabIndex}
              </button>
              {index < 2 && <div className={styles.tabDivider}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {state.currentTab === 1 && (
        <div className={styles.level}>
          <h2 className={styles.title2}>第一關：翻牌配對</h2>
          <div className={styles.cardGrid}>{cardElements}</div>
        </div>
      )}
      {state.currentTab === 2 && (
        <div className={styles.level}>
          <h2 className={styles.title2}>第二關：尋找物品</h2>
          <div className={styles.objectToFindContainer}>
            <img
              src={objectToFind.image}
              alt={objectToFind.name}
              className={styles.objectToFindImage}
            />
            <p>
              在圖片中找出所有的{objectToFind.name}（共
              {balloonPositions.length}個）
            </p>
          </div>
          <div className={styles.imageComparisonContainer}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.image}
                src="/game/find.jpg"
                alt="尋找物品場景"
              />
              {balloonPositions.map((position, index) => (
                <button
                  key={index}
                  className={`${styles.difference} ${
                    state.foundDifferences.includes(index) ? styles.found : ''
                  }`}
                  style={{
                    left: position.x,
                    top: position.y,
                  }}
                  onClick={() => handleDifferenceClick(index)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleDifferenceClick(index)
                    }
                  }}
                  aria-label={`${objectToFind.name} ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
          <p className={styles.p2}>
            找到的{objectToFind.name}：{state.foundDifferences.length}/
            {balloonPositions.length}
          </p>
        </div>
      )}
      {state.currentTab === 3 && (
        <div className={styles.level}>
          <h2 className={styles.title2}>第三關：謎語遊戲</h2>
          <p className={styles.p}>回答以下三個謎題以通關：</p>
          <div className={styles.riddleContainer}>
            {riddles.map((riddle, index) => (
              <div key={index} className={styles.riddle}>
                <p>
                  {index + 1}. {riddle.question}
                </p>
                <input
                  type="text"
                  placeholder="請輸入答案"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      checkAnswer(index, e.target.value)
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="container mt-2 d-block justify-content-center">
      {!state.gameStarted && <IntroScreen />}
      {state.gameStarted && !state.gameCompleted && (
        <>
          <h1 className={styles.title}>\密室逃脫小遊戲/</h1>
          {state.message && (
            <div className={styles.message}>{state.message}</div>
          )}
          {state.showLevelComplete[state.currentTab - 1] ? (
            <LevelCompleteScreen level={state.currentTab} />
          ) : (
            <GameContent />
          )}
        </>
      )}
      {state.gameCompleted && <GameCompletedScreen />}
    </div>
  )
}
