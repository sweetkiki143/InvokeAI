import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { InvControl } from 'common/components/InvControl/InvControl';
import { InvNumberInput } from 'common/components/InvNumberInput/InvNumberInput';
import { InvSlider } from 'common/components/InvSlider/InvSlider';
import { useImageSizeContext } from 'features/parameters/components/ImageSize/ImageSizeContext';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const selector = createMemoizedSelector(
  [stateSelector],
  ({ generation, config }) => {
    const { min, sliderMax, inputMax, fineStep, coarseStep } = config.sd.height;
    const { model } = generation;

    const initial = ['sdxl', 'sdxl-refiner'].includes(
      model?.base_model as string
    )
      ? 1024
      : 512;

    return {
      initial,
      min,
      max: sliderMax,
      inputMax,
      step: coarseStep,
      fineStep,
    };
  }
);

export const ParamHeight = memo(() => {
  const { t } = useTranslation();
  const ctx = useImageSizeContext();
  const { initial, min, max, inputMax, step, fineStep } =
    useAppSelector(selector);

  const onChange = useCallback(
    (v: number) => {
      ctx.heightChanged(v);
    },
    [ctx]
  );

  const onReset = useCallback(() => {
    ctx.heightChanged(initial);
  }, [ctx, initial]);

  const marks = useMemo(() => [min, initial, max], [min, initial, max]);

  return (
    <InvControl label={t('parameters.height')}>
      <InvSlider
        value={ctx.height}
        onChange={onChange}
        onReset={onReset}
        min={min}
        max={max}
        step={step}
        fineStep={fineStep}
        marks={marks}
      />
      <InvNumberInput
        value={ctx.height}
        onChange={onChange}
        min={min}
        max={inputMax}
        step={step}
        fineStep={fineStep}
      />
    </InvControl>
  );
});

ParamHeight.displayName = 'ParamHeight';