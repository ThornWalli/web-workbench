import { ipoint } from '@js-basics/vector';

function drawDial(context, radius, strokeWidth, colors) {
  context.beginPath();
  context.arc(0, 0, radius - strokeWidth, 0, 2 * Math.PI, false);
  context.fillStyle = colors[0];
  context.fill();
}

function drawSegments(context, radius, colors) {
  let i;
  // Segments
  for (i = 0; i < 60; i++) {
    context.rotate(-Math.PI / 2);
    context.beginPath();
    const y = 0 - radius + 12;
    const height = 6;
    context.moveTo(0, y);
    context.lineTo(0, y - height);
    context.rotate(Math.PI / 3 / 5);
    context.lineWidth = 2;
    context.strokeStyle = colors[1];
    context.stroke();
  }

  context.rotate(-(Math.PI / 3 / 5) * 60);

  for (i = 0; i < 16; i++) {
    context.rotate(-Math.PI / 2);
    context.beginPath();
    const y = 0 - radius + 15;
    const width = 6;
    const height = 10;
    context.moveTo(0, y);
    context.lineTo(0 + width / 2, y - height / 2);
    context.lineTo(0, y - height);
    context.lineTo(0 - width / 2, y - height / 2);
    context.lineTo(0, y);
    context.rotate(Math.PI / 3);
    context.fillStyle = colors[1];
    context.fill();
  }
  context.rotate((-Math.PI / 3) * 16);
}

export function drawClockHands(sprites, date, context, center, size) {
  const hours =
    date.getHours() * ((Math.PI * 2) / 12) +
    (((Math.PI * 2) / 12) * date.getMinutes()) / 60;
  const minutes = date.getMinutes() * ((Math.PI * 2) / 60);
  const seconds = date.getSeconds() * ((Math.PI * 2) / 60);

  // Hours
  context.rotate(hours);
  context.drawImage(sprites[0], -center.x, -center.y, size.x, size.y);
  context.rotate(-hours);

  // Minutes
  context.rotate(minutes);
  context.drawImage(sprites[1], -center.x, -center.y, size.x, size.y);
  context.rotate(-minutes);

  // Seconds
  context.rotate(seconds);
  context.drawImage(sprites[2], -center.x, -center.y, size.x, size.y);
  context.rotate(-seconds);
}

export function generatesSprites(width, height, strokeWidth, colors) {
  const offset = 5;
  const radius = width / 2 - offset;
  const center = ipoint(() => radius + offset);

  const funcs = [
    (context, canvas) => {
      context.translate(center.x, center.y);

      const hourArrowWidth = 3;
      const hourArrowHeight = [0.5, 0.34];
      const hourArrowCenterX = 0;
      const hourArrowCenterY = 0;

      context.beginPath();
      context.moveTo(hourArrowCenterX, hourArrowCenterY);
      context.lineTo(
        hourArrowCenterX - hourArrowWidth,
        hourArrowCenterY - (canvas.width / 2) * hourArrowHeight[1]
      );

      context.lineTo(
        hourArrowCenterX,
        hourArrowCenterY - (canvas.width / 2) * hourArrowHeight[0]
      );
      context.lineTo(
        hourArrowCenterX + hourArrowWidth,
        hourArrowCenterY - (canvas.width / 2) * hourArrowHeight[1]
      );
      context.lineTo(hourArrowCenterX, hourArrowCenterY);
      context.strokeStyle = colors[1];
      context.fillStyle = colors[1];
      context.stroke();
      context.fill();
    },
    (context, canvas) => {
      context.translate(center.x, center.y);

      const minuteArrowWidth = 4;
      const minuteArrowHeight = [0.7, 0.54];
      const minuteArrowCenterX = 0;
      const minuteArrowCenterY = 0;

      context.beginPath();
      context.moveTo(minuteArrowCenterX, minuteArrowCenterY);
      context.lineTo(
        minuteArrowCenterX - minuteArrowWidth,
        minuteArrowCenterY - (canvas.width / 2) * minuteArrowHeight[1]
      );

      context.lineTo(
        minuteArrowCenterX,
        minuteArrowCenterY - (canvas.width / 2) * minuteArrowHeight[0]
      );
      context.lineTo(
        minuteArrowCenterX + minuteArrowWidth,
        minuteArrowCenterY - (canvas.width / 2) * minuteArrowHeight[1]
      );
      context.lineTo(minuteArrowCenterX, minuteArrowCenterY);
      context.strokeStyle = colors[1];
      context.fillStyle = colors[1];
      context.stroke();
      context.fill();
    },
    (context, canvas) => {
      context.translate(center.x, center.y);

      const secondArrowWidth = 0;
      const secondArrowHeight = 0.74;
      const secondArrowCenterX = 0;
      const secondArrowCenterY = 0;

      context.beginPath();
      context.moveTo(secondArrowCenterX, secondArrowCenterY);
      context.lineTo(
        secondArrowCenterX + secondArrowWidth,
        secondArrowCenterY - (canvas.width / 2) * secondArrowHeight
      );
      context.lineTo(secondArrowCenterX, secondArrowCenterY);
      context.strokeStyle = colors[2];
      context.stroke();
    },
    context => {
      context.translate(center.x, center.y);
      drawDial(context, radius, strokeWidth, colors);
    },
    context => {
      context.translate(center.x, center.y);
      drawSegments(context, radius, colors);
    }
  ];

  return funcs.map(func => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    func(context, canvas);
    return canvas;
  });
}
