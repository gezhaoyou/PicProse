"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Transformer,
  Image as KonvaImage,
  Group,
} from "react-konva";
import Konva from "konva";
import { FilterImage } from "./component/filter";
import { Frame } from "./component/frame";
import WebFontLoader from "webfontloader";
import { useShapesContext } from "./context/useShapesContext";

export const Canvas = () => {
  const stageRef = useRef<Konva.Stage>();
  const layerRef = useRef<Konva.Layer>();
  const trRef = useRef<Transformer>();

  const [loaded, setLoaded] = useState(false);
  const { shapes, setSelectedShape } = useShapesContext();

  const initFont = () => {
    // Fetch necessary fonts.
    WebFontLoader.load({
      google: {
        families: [
          "Open Sans:400,600,700",
          "Roboto",
          "Raleway",
          "Droid Sans",
          "Droid Serif",
          "Anek Latin",
        ],
      },
      fontactive: () => {
        setTimeout(() => {
          setLoaded(true);
        }, 1000);
      },
    });
  };

  useEffect(() => {
    initFont();

    function handleResize() {
      setStageDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== "undefined") {
      handleResize(); // 初始化时设置舞台尺寸
      window.addEventListener("resize", handleResize); // 监听窗口尺寸变化

      // 清理函数，防止内存泄漏
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const [stageDimensions, setStageDimensions] = useState({
    width: 1280,
    height: 720,
  });
 
  return (
    <Stage
      ref={stageRef}
      width={stageDimensions.width}
      height={stageDimensions.height - 15}
      className="bg-slate-100 overflow-x-scroll"
    >
      <Layer scaleX={0.5} scaleY={0.5} ref={layerRef}>
        <Frame width={1280} height={720} radius={10}>
          {shapes.map((shape, index) => {
            console.log(shape.type);
            if (shape.type === "rect") 
              return (<Rect key={shape.id} {...shape} />)
            else if (shape.type === "text")
              return (
                <Text
                  key={shape.id}
                  fontFamily={loaded ? "Anek Latin" : "Arial"}
                  fontSize={40}
                  onClick={ () =>  setSelectedShape(shape)}
                  {...shape}
                />
              );
            else if (shape.type === "image")
              return (
                <FilterImage
                  width={1280}
                  height={720}
                  keepRatio={true}
                  url={shape.url}
                  blur={shape.blur}
                  onClick={ () =>  setSelectedShape(shape)}
                />
              );
          })}
        </Frame>
      </Layer>
    </Stage>
  );
};
