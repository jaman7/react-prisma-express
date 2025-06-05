import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import CaretIcon from './icons/CaretIcon';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

interface IPadding {
  paddingTop?: number | null;
  paddingRight?: number | null;
  paddingBottom?: number | null;
  paddingLeft?: number | null;
}

interface ICollapseProps {
  children: React.ReactNode;
  duration?: number;
  ease?: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear';
  padding?: IPadding | null;
  className?: string;
  iconArrowLast?: boolean;
  header?: string;
}

const paddingDefault: IPadding = {
  paddingTop: 8,
  paddingRight: 8,
  paddingBottom: 8,
  paddingLeft: 8,
};

const Collapse: React.FC<ICollapseProps> = ({
  className,
  children,
  duration = 0.35,
  ease = 'easeInOut',
  padding = {},
  iconArrowLast = false,
  header,
}) => {
  const [paddings, setPaddings] = useState<IPadding | null>(paddingDefault);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = paddings || {};

  const { t } = useFallbackTranslation();

  const stablePadding = useMemo(() => ({ ...paddingDefault, ...padding }), [padding]);
  const collapsedClasses = useMemo(() => classNames('collapsed', className ?? ''), [className]);

  useEffect(() => {
    if (JSON.stringify(paddings) !== JSON.stringify(stablePadding)) {
      setPaddings(stablePadding);
    }
  }, [stablePadding, paddings]);

  return (
    <div className={collapsedClasses}>
      {header && (
        <div
          className={classNames('collapsed__header px-1', {
            'collapsed__header--reversed': iconArrowLast,
            'mb-2': collapsed,
          })}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <CaretIcon className={`icon ${collapsed ? 'open' : ''}`} />

          <span>{t(header)}</span>
        </div>
      )}

      <motion.div
        initial={false}
        animate={{
          height: collapsed ? 'auto' : 0,
          opacity: collapsed ? 1 : 0,
          paddingLeft: `${paddingLeft ?? 0}px`,
          paddingRight: `${paddingRight ?? 0}px`,
          paddingTop: collapsed ? `${paddingTop ?? 0}px` : '0',
          paddingBottom: collapsed ? `${paddingBottom ?? 0}px` : '0',
        }}
        style={{ overflow: 'hidden' }}
        className="d-block"
        transition={{
          duration,
          ease,
        }}
        aria-hidden={!collapsed}
        role="region"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Collapse;
