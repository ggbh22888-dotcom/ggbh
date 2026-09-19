import Reveal from "./Reveal.jsx";
import "./Introduction.css";

const chineseCopy = [
  "从一个想法开始，\n到故事、角色、影像、声音，\n最后成为一部真正能够让人记住的作品。",
  "果甘半壶是一间位于新加坡的独立 AI 影像工作室。",
  "我们结合传统电影叙事、创意导演与生成式 AI，\n制作短剧、广告、音乐影像、品牌故事及原创 AI 影视内容。",
];

export default function Introduction() {
  return (
    <section className="intro section section--ivory" id="about" aria-labelledby="intro-title">
      <div className="intro__grid shell">
        <div className="intro__aside">
          <Reveal as="p" className="eyebrow eyebrow--index" data-index="02">
            Introduction
          </Reveal>
          <Reveal as="h2" className="intro__title display" id="intro-title" delay={80}>
            <span>Idea</span>
            <span className="intro__arrow" aria-hidden="true">
              →
            </span>
            <span>Story</span>
            <span className="intro__arrow" aria-hidden="true">
              →
            </span>
            <span>Cinema</span>
          </Reveal>
        </div>

        <div className="intro__body">
          {chineseCopy.map((block, index) => (
            <Reveal as="p" key={block} className="intro__han han-display" delay={index * 90}>
              {block.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </Reveal>
          ))}

          <Reveal as="blockquote" className="intro__quote" delay={120}>
            <p>Technology creates possibilities.</p>
            <p>Story creates connection.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
