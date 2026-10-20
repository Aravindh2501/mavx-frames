export const isCloudinary = (src: string) =>
  src.includes('res.cloudinary.com') && src.includes('/image/upload/')

export const cloudinaryLoader = ({ src, width }: { src: string; width: number }) =>
  src.replace('/image/upload/', `/image/upload/c_limit,w_${width},f_auto,q_auto:best/`)

export const thumbUrl = (src: string, size = 240) =>
  isCloudinary(src)
    ? src.replace('/image/upload/', `/image/upload/c_fill,w_${size},h_${size},f_auto,q_auto/`)
    : src

export const videoPoster = (src: string) =>
  src.includes('res.cloudinary.com') && src.includes('/video/upload/')
    ? src
        .replace('/video/upload/', '/video/upload/so_1,w_900,f_jpg,q_auto:good/')
        .replace(/\.[a-z0-9]+$/i, '.jpg')
    : undefined
