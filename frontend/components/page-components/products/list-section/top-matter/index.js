import Matter from 'matter-js'
import decomp from 'poly-decomp'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import CircleBtn from '@/components/UI/circle-btn'
import myStyle from '../list.module.css'
import { RiGhostLine } from 'react-icons/ri'
import { BiGhost } from 'react-icons/bi'
import { TbArrowBigDown } from 'react-icons/tb'
import 'animate.css/animate.css'

export default function TopMatter() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const updateDimensions = useCallback(() => {
    setDimensions({
      width: document.documentElement.clientWidth,
      height: window.innerHeight - 100,
    })
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [updateDimensions])

  const createObject = useCallback(() => {
    const { Bodies, Composite, Common } = Matter

    if (engineRef.current) {
      const box = Bodies.circle(dimensions.width / 2, 0, 65, {
        restitution: 1,
        friction: 0.1,
        frictionAir: 0.001, // 增加空氣摩擦力
        render: {
          sprite: {
            texture: 'http://localhost:3000/ghost/ghost_01.png',
            xScale: 0.5,
            yScale: 0.5,
          },
        },
      })
      Composite.add(engineRef.current.world, box)
    }
  }, [dimensions.width])

  const createObject2 = useCallback(() => {
    const { Bodies, Composite, Common } = Matter

    if (engineRef.current) {
      const box = Bodies.circle(dimensions.width / 2, 0, 65, {
        restitution: 1,
        friction: 0.1,
        frictionAir: 0.001, // 增加空氣摩擦力
        render: {
          sprite: {
            texture: 'http://localhost:3000/ghost/ghost_11.png',
            xScale: 0.5,
            yScale: 0.5,
          },
        },
      })
      Composite.add(engineRef.current.world, box)
    }
  }, [dimensions.width])

  useEffect(() => {
    const {
      Engine,
      Render,
      Runner,
      MouseConstraint,
      Mouse,
      Composite,
      Bodies,
      World,
      Composites,
      Common,
      Events,
    } = Matter

    // 創建引擎
    const engine = Engine.create()
    engineRef.current = engine

    // 創建渲染器
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        background: 'transparent',
        wireframes: false,
      },
    })
    renderRef.current = render

    // 運行渲染器和引擎
    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engine)

    // 設置滑鼠控制
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: true },
      },
    })
    Composite.add(engine.world, mouseConstraint)
    render.mouse = mouse

    // 添加邊界
    const wallThickness = 50
    const addBoundaries = () => [
      Bodies.rectangle(
        dimensions.width / 2,
        -wallThickness / 2,
        dimensions.width,
        wallThickness,
        { isStatic: true }
      ),
      Bodies.rectangle(
        dimensions.width / 2,
        dimensions.height + wallThickness / 2,
        dimensions.width,
        wallThickness,
        { isStatic: true }
      ),
      Bodies.rectangle(
        dimensions.width + wallThickness / 2,
        dimensions.height / 2,
        wallThickness,
        dimensions.height,
        { isStatic: true }
      ),
      Bodies.rectangle(
        -wallThickness / 2,
        dimensions.height / 2,
        wallThickness,
        dimensions.height,
        { isStatic: true }
      ),
    ]

    Composite.add(engine.world, addBoundaries())

    var stack = Composites.stack(100, 0, 25, 4, 10, 10, function (x, y) {
      return Bodies.circle(x, y, Common.random(15, 30), {
        restitution: 0.6,
        friction: 0.1,
      })
    })

    Composite.add(engine.world, [
      stack,
      Bodies.polygon(200, 460, 3, 60),
      Bodies.polygon(400, 460, 5, 60),
      Bodies.rectangle(600, 460, 80, 80),
    ])

    // 處理視窗大小變化
    const handleResize = () => {
      render.canvas.width = dimensions.width
      render.canvas.height = dimensions.height
      render.options.width = dimensions.width
      render.options.height = dimensions.height

      World.clear(engine.world, false)
      Composite.add(engine.world, addBoundaries())

      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: dimensions.width, y: dimensions.height },
      })
    }

    window.addEventListener('resize', handleResize)

    // 監聽滑鼠移動事件
    Events.on(mouseConstraint, 'mousemove', function (event) {
      const mousePosition = event.mouse.position

      // 檢測滑鼠與物體的碰撞
      const bodies = Composite.allBodies(engine.world)
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i]
        if (Matter.Bounds.contains(body.bounds, mousePosition)) {
          // 檢測是否在物體內部
          if (Matter.Vertices.contains(body.vertices, mousePosition)) {
            // 應用碰撞效果，例如施加一個力
            Matter.Body.applyForce(body, mousePosition, {
              x: (mousePosition.x - body.position.x) * 0.01,
              y: (mousePosition.y - body.position.y) * 0.01,
            })
          }
        }
      }
    })

    // 清理函數
    return () => {
      window.removeEventListener('resize', handleResize)
      Render.stop(render)
      Runner.stop(runner)
      Engine.clear(engine)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
    }
  }, [dimensions])

  return (
    <>
      <div
        className="background"
        ref={canvasRef}
        style={{
          padding: 0,
          margin: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      />
      <CircleBtn
        className={myStyle.addbtn}
        onClick={createObject}
        btnText={<RiGhostLine />}
        href={''}
      />
      <CircleBtn
        className={myStyle.addbtn2}
        onClick={createObject2}
        btnText={<BiGhost />}
        href={''}
      />
      <div className={myStyle.text}>
        <a href="#buy">Board Game Store</a>
        <div  className={`${myStyle.arrowIcon}`}>點擊我，立即購物！</div>
        {/* <div
          className={`${myStyle.arrowIcon} animate__animated animate__shakeY animate__infinite animate__slow`}
        >
          <TbArrowBigDown />
        </div> */}
      </div>

      <style jsx>
        {`
          .background {
            background-image: url('http://localhost:3000/home/wall.jpg');
          }
        `}
      </style>
    </>
  )
}
