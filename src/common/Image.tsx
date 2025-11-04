import { ImageCommonComponent } from '../interface/propsInterface';

function Image(props: ImageCommonComponent) {
  const { src, loading = 'lazy', width, height, className, alt } = props;
  return (
    <picture>
      <source src={src} />
      <img
        src={src}
        loading={loading}
        width={width}
        height={height}
        className={className}
        alt={alt}
      />
    </picture>
  );
}

export default Image;
