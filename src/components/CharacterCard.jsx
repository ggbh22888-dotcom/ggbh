import CinematicFrame from "./CinematicFrame.jsx";
import { characterSlots } from "../content/dearGoodbye.js";
import { dearGoodbye } from "../content/media.js";
import "./CharacterCard.css";

/**
 * One recurring character in the story world. The portrait slot takes
 * the official character portrait and the strip below it a final film
 * frame of the same character; both stay as studio placeholders until
 * the originals are connected in src/content/media.js. No stand-in
 * faces are generated.
 */
export default function CharacterCard({ character }) {
  const media = dearGoodbye.characters[character.slug] || {};

  return (
    <article className="cast">
      <CinematicFrame
        className="cast__portrait frame--fixed"
        tone={character.tone}
        ratio="3 / 4"
        src={media.portrait || ""}
        alt={`${character.latin} — character portrait`}
        label="Character Portrait"
        caption="官方角色定妆"
      />

      <div className="cast__body">
        <h3 className="cast__name">
          <span className="cast__latin">{character.latin}</span>
          <span className="cast__han">{character.han}</span>
        </h3>
        <p className="cast__line">{character.lineHan}</p>
        <p className="cast__line cast__line--en">{character.lineEn}</p>

        <dl className="cast__slots">
          {characterSlots.map((slot) => (
            <div className="cast__slot" key={slot.label}>
              <dt>{slot.label}</dt>
              <dd>{slot.han}</dd>
            </div>
          ))}
        </dl>

        <CinematicFrame
          className="cast__frame"
          tone={character.tone}
          ratio="2.39 / 1"
          src={media.frame || ""}
          alt={`${character.latin} — final film frame`}
          label="Final Film Frame"
        />
      </div>
    </article>
  );
}
