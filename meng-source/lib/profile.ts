export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Post = {
  id: string;
  kicker?: string;
  text?: string[];
  chips?: string[];
  photos?: Photo[];
  link?: { href: string; label: string };
  poem?: boolean;
};

export type Tab = {
  id: string;
  label: string;
  posts: Post[];
};

export const profile = {
  name: "轩",
  handle: "@梦",
  subtitle: "她在时间的褶皱里行走",
  poem: ["醒来时坠入镜像的裂隙", "外界的声音牵引她听见", "却不停留"],
  facts: [
    { k: "性别", v: "女" },
    { k: "年龄", v: "19" },
    { k: "星座", v: "摩羯座" },
    { k: "人格", v: "I / ENTJ" },
    { k: "倾向", v: "Le-T" },
  ],
  places: ["信纸", "十年", "雾山影"],
  marks: ["七无", "主部 A 级", "好女人"],
  song: {
    title: "Lazy Type Beat",
    artist: "aayuyuu",
    id: 3316945866,
  },
  banner: {
    src: "/images/banner.jpg",
    alt: "水洼里一个人的倒影，黑白",
    width: 664,
    height: 685,
  },
  avatar: {
    src: "/images/portrait.jpg",
    alt: "黑白画里一只垂耳白毛小狗，肩上挂着皮带和链子",
    width: 1170,
    height: 1168,
  },
  schedule: {
    href: "https://www.kdocs.cn/l/ckY7qZKvlF5t",
    label: "排单表请看",
  },
};

export const tabs: Tab[] = [
  {
    id: "meet",
    label: "相识",
    posts: [
      {
        id: "who",
        kicker: "众生梦",
        text: ["鹤闻野", "曾通关：愚戏、观宴、蛇漪、素雪 II"],
        photos: [
          {
            src: "/images/lace.jpg",
            alt: "白色蕾丝的近景",
            width: 736,
            height: 316,
          },
        ],
      },
    ],
  },
  {
    id: "know",
    label: "相知",
    posts: [
      {
        id: "roles",
        kicker: "黄粱梦",
        text: [
          "主 · 钓系暧昧拉扯、温柔年上引导、白切黑",
          "副 · 热脸贱狗、日常高恋、年下傲娇、恶趣味",
          "上位 ＞ 平权 ＝ 下位",
          "多为姐恋。特殊要求，提前告知。",
        ],
        chips: ["白话", "高剖", "轻文艺", "微擦", "动描", "中高恋", "高擦"],
      },
      {
        id: "model",
        kicker: "常驻建模",
        text: ["白斗 / 蝙蝠斗", "桂冠耳正 0.6"],
        photos: [
          {
            src: "/images/cross.jpg",
            alt: "系着银灰色丝带的白色十字架",
            width: 400,
            height: 427,
          },
        ],
      },
      {
        id: "online",
        kicker: "在职",
        text: ["查找我是否在雾山影在职。"],
        link: {
          href: "http://45.207.195.35/",
          label: "打开雾山影",
        },
      },
    ],
  },
  {
    id: "keep",
    label: "相惜",
    posts: [
      {
        id: "oil",
        kicker: "因果竟",
        poem: true,
        text: [
          "拒绝静止，拒绝被既定规则束缚。",
          "她是未干的油彩，",
          "是循环中永不重复的一例。",
        ],
      },
      {
        id: "huashu",
        kicker: "话术 / 随笔",
        text: ["折页里的房间。话术与随笔收在原文。"],
        photos: [
          {
            src: "/images/huashu.jpg",
            alt: "白色与淡粉卧室的折页拼贴",
            width: 1516,
            height: 1516,
          },
        ],
        link: {
          href: "https://www.kdocs.cn/l/cuPcyRFMuSA6",
          label: "打开话术",
        },
      },
      {
        id: "banzeng",
        kicker: "板赠",
        text: ["留下的东西，按原文查看。"],
        photos: [
          {
            src: "/images/banzeng.jpg",
            alt: "白粉色房间与衣饰的三联折页",
            width: 1516,
            height: 1516,
          },
        ],
        link: {
          href: "https://www.kdocs.cn/l/cicWKGIyYPn8",
          label: "打开板赠",
        },
      },
      {
        id: "toupai",
        kicker: "头牌卡",
        text: ["头牌收在这张卡里。"],
        photos: [
          {
            src: "/images/toupai.jpg",
            alt: "粉色茶具、时钟与玩偶的折页拼贴",
            width: 1516,
            height: 1516,
          },
        ],
        link: {
          href: "https://www.kdocs.cn/l/ctHqS3KnDzNa",
          label: "打开头牌卡",
        },
      },
      {
        id: "echo",
        poem: true,
        text: [
          "她是 Key A。当她经过，万物开始轻声重复自己的名字。",
          "回声之后，还有回声。",
          "现在，牵上我，与我一同坠入。",
          "造梦者 敬啟",
        ],
        photos: [
          {
            src: "/images/charm.jpg",
            alt: "透明星星挂件",
            width: 558,
            height: 558,
          },
        ],
      },
    ],
  },
  {
    id: "note",
    label: "须知",
    posts: [
      {
        id: "card",
        kicker: "虚恋须知 · 轩专属",
        text: [
          "风格：高恋、挑逗、占有欲、腹黑、敏感、温柔、小狗、恶趣味。",
        ],
        photos: [
          {
            src: "/images/notice.jpg",
            alt: "虚恋须知信笺，姓名为轩",
            width: 1280,
            height: 1811,
          },
        ],
      },
      {
        id: "rules",
        kicker: "约前",
        text: [
          "喜欢的风格可以提前告诉我。我会为你带来我力所能及、最棒的体验。",
          "请不要把我们的约会内容给其他人阅读。若是闺蜜，需要先取得我的同意。",
          "我的恋感取决于你的态度和回应，主打高恋、温柔。",
          "需要暂停，或临时有事，直接跟我说。我会等着你。",
          "请不要故意欺负或辱骂你的爱人，也请不要恶意退出。我为此做了十二分的准备。",
          "你读到这里时，我已经为我们的约会做好了准备。",
        ],
      },
      {
        id: "review",
        kicker: "陪评",
        text: ["如须陪评，打出「轩轾」即可。"],
        photos: [
          {
            src: "/images/stars.jpg",
            alt: "白底上散落的手绘星星",
            width: 2944,
            height: 968,
          },
        ],
      },
      {
        id: "close",
        poem: true,
        text: [
          "光试图为她画像，",
          "影子总是抢先一步逃走。",
          "每个黎明都在她身后合拢，",
          "每个黄昏都在她面前展开。",
        ],
      },
    ],
  },
];
