const goldenRatio = (1 + Math.sqrt(5)) / 2;
const irrational2 = 1 + Math.sqrt(2);
const irrational3 = (2 + Math.sqrt(2)) / 1; // Approximation of the golden angle in radians

interface LayoutOptions {
  radius?: number;
  radiusOffset?: number;
  spacing?: number;
  theta?: number;
}

interface LayoutedDatum<T> extends T {
  r: number;
  x: number;
  y: number;
}

/**
 * Phyllotaxis-Layout für beliebige Daten.
 * @param data Array der Ursprungsdaten
 * @param options Layout-Optionen (alle optional)
 * @returns Array der Daten mit x, y, r
 */
export function layoutPhyllotaxis<T>(
  data: T[],
  options: LayoutOptions = {}
): LayoutedDatum<T>[] {
  const {
    radius = 0.8,
    radiusOffset = 0.5,
    spacing = 1.2,
    theta = (2 * Math.PI) / irrational3,
  } = options;

  return data.map((d, i) => {
    const localTheta = theta * i;
    const localRadius = Math.sqrt(i) * spacing * radius + radiusOffset * radius;

    return {
      ...d,
      r: radius,
      x: Math.cos(localTheta) * localRadius,
      y: Math.sin(localTheta) * localRadius,
    };
  });
}
