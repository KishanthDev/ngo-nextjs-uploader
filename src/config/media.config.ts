import { MediaConfig } from "@/types/media";

export const MEDIA_CONFIG: MediaConfig = {
  ngo: {
    displayName: "NGO Website",
    sections: {
      hero_banner: {
        maxImages: 1,
        allowReplace: true,
        allowedFormats: ["jpg", "jpeg", "png", "webp"],
      },
      about_us: {
        maxImages: 3,
        allowReplace: true,
      },
      testimonials: {
        maxImages: 10,
        allowReplace: false,
      },
    },
  },
  furniture: {
    displayName: "Furniture Website",
    sections: {
      hero_banner: {
        maxImages: 1,
        allowReplace: true,
      },
      gallery: { maxImages: 50, allowReplace: false },
    },
  },
};