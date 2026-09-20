export interface OptionInfo {
  image: string;
  description: string;
}

// 🔥 실제 참고 이미지 반영 완료. public/images/options/ 아래 파일들을 사용합니다.
// '유리병 케이스'만 대응하는 사진이 아직 없어서 placehold.co를 임시로 남겨뒀습니다 —
// 나중에 사진 준비되면 public/images/options/case-jar.jpg로 추가하고 아래 image 값만 바꾸면 됩니다.
export const OPTION_INFO: Record<string, OptionInfo> = {
  // 재질 (MATERIAL)
  'PLA': {
    image: '/images/options/material-pla.jpg',
    description:
      '친환경 PLA 소재로 가볍고 견고하며, 다양한 색상 표현이 가능합니다. 가장 많이 선택하시는 기본 소재입니다.',
  },
  '레진': {
    image: '/images/options/material-resin.jpg',
    description:
      '레진(Resin) 소재는 표면이 매끄럽고 디테일 표현력이 뛰어나, 얼굴의 특징과 질감을 더 섬세하게 살릴 수 있습니다.',
  },
  'PLA+레진 하이브리드': {
    image: '/images/options/material-hybrid.jpg',
    description:
      '기본 형태는 PLA로, 얼굴 등 디테일이 중요한 부분은 레진으로 마감하는 방식입니다. 합리적인 가격에 높은 완성도를 원하실 때 추천합니다.',
  },

  // 케이스 (CASE)
  '기본 포장': {
    image: '/images/options/case-basic.jpg',
    description: '별도 케이스 없이 안전 포장재로만 배송됩니다.',
  },
  '유리 케이스': {
    image: '/images/options/case-glass.jpg',
    description:
      '투명 유리 케이스에 담아 먼지와 손상으로부터 보호하며, 어디에 두어도 고급스러운 분위기를 연출합니다.',
  },
  '원목 케이스': {
    image: '/images/options/case-wood.jpg',
    description: '따뜻한 느낌의 원목 프레임 케이스로, 클래식하고 차분한 분위기를 더합니다.',
  },
  '조명 케이스': {
    image: '/images/options/case-lamp.jpg',
    description: '은은한 LED 조명이 내장된 케이스로, 밤에도 은은하게 빛나는 연출이 가능합니다.',
  },
  '유리병 케이스': {
    image: 'https://placehold.co/480x320/f6f4ef/8c6f4e?text=Jar+Case',
    description: '밀폐형 유리병 케이스로, 아늑하고 아기자기한 느낌을 줍니다.',
  },
  '원목 받침': {
    image: '/images/options/case-wood-stand.jpg',
    description: '심플한 원목 받침대로, 케이스 없이도 조형물을 안정적으로 세워둘 수 있습니다.',
  },
  '아크릴 명패 추가': {
    image: '/images/options/case-nameplate.jpg',
    description: '이름, 날짜, 문구 등을 새길 수 있는 아크릴 명패를 함께 제작해드립니다.',
  },

  // 사이즈 (SIZE)
  '10cm': {
    image: '/images/options/size-10cm.jpg',
    description: '미니어처 사이즈로, 책상이나 협탁 위에 부담 없이 올려두기 좋습니다.',
  },
  '15cm': {
    image: '/images/options/size-15cm.jpg',
    description: '가장 많이 선택하시는 기본 사이즈로, 어느 공간에나 자연스럽게 어울립니다.',
  },
  '20cm': {
    image: '/images/options/size-20cm.jpg',
    description: '디테일이 한층 더 살아나는 사이즈로, 존재감 있게 두고 싶으실 때 추천합니다.',
  },
  '25cm': {
    image: '/images/options/size-25cm.jpg',
    description: '거실 등 넓은 공간에 두기 좋은 사이즈입니다.',
  },
  '30cm': {
    image: '/images/options/size-30cm.jpg',
    description: '가장 큰 사이즈로, 시선이 집중되는 공간에 메인으로 두기 좋습니다.',
  },
};