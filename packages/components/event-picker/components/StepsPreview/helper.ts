export function getPercent(part, whole = 1, fix = 3, sign = true, minValue = false) {
  part = Number.parseFloat(part);
  whole = Number.parseFloat(whole + '');
  let percent: number | string = (part / whole) * 100;
  if (!isNaN(percent)) {
    percent = percent.toPrecision(3);
  } else {
    percent = 0;
  }

  if (sign) {
    percent += '%';
  }

  if (minValue && part < 1 / Math.pow(10, fix + 1)) {
    percent = `< ${(1 / Math.pow(10, fix + 1)) * 100}%`;
  }

  return `${percent}`;
}

export function getStepId(step, index) {
  return step.renderKey || step.id + index;
}