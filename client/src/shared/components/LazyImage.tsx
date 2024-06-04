import { useState, useEffect, useRef } from 'react';

export interface ILazyImage {
  id?: string;
  className?: string;
  src?: string;
  alt?: string;
  onClick?: () => void;
}

const LazyImage = (props: ILazyImage) => {
  const { id, className, src, alt, onClick } = props || {};

  const [loaded, setLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef?.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <>
      {!loaded && <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" aria-hidden="true" />}
      <img
        id={id}
        loading="lazy"
        src={src}
        alt={alt}
        ref={imgRef}
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? 'lazyloaded' : 'lazyloading'}`}
        onClick={onClick}
      />
    </>
  );
};

export default LazyImage;
