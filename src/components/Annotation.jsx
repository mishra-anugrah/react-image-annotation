import React, { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

export const Annotation = (props) => {
  const { shapeProps, isSelected, onSelect, onChange } = props;
  const shapeRef = useRef();
  const transformRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // attaching transformer manually on selection of an annotation
      transformRef.current.setNode(shapeRef.current);
      transformRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const onMouseEnter = (event) => {
    // updating cursor to denote ability to move annotation
    event.target.getStage().container().style.cursor = "move";
  };

  const onMouseLeave = (event) => {
    // reset cursor to denote ability to create new annotation
    event.target.getStage().container().style.cursor = "crosshair";
  };

  return (
    <>
      <Rect
        fill="transparent"
        stroke="#b51616"
        strokeWidth={5}
        onMouseDown={onSelect}
        ref={shapeRef}
        {...shapeProps}
        rotation={false}
        draggable
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDragEnd={(event) => {
          onChange({
            ...shapeProps,
            x: event.target.x(),
            y: event.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            x1: node.x(),
            y1: node.y(),
            x2: node.x() + Math.max(5, node.width() * scaleX),
            y2: Math.max(5, node.height() * scaleY),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          rotateEnabled={false}
          flipEnabled={false}
          ref={transformRef}
          stroke="#45678a"
        />
      )}
    </>
  );
};
