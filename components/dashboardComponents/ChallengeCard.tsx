/**
 * Challenge Cards Component
 *
 * Cards for challenge section in hack center
 * To add a linebreak for the description, simply add \n into the string value where needed in firebase
 */

function ChallengeCard(props) {
  var description;
  if (props.description !== undefined && props.description !== null) {
    description = props.description.replaceAll('\\n', '\n');
  }
  return (
    <div className="inline-block w-full mb-[1em] sm:p-6 p-2 border-2 rounded-lg">
      <div className="md:text-xl text-lg font-bold mb-4">{props.title}</div>
      <div className="">
        <div className="whitespace-pre-line md:text-sm text-xs">{description}</div>
      </div>
      {props.prizes !== null && props.prizes !== undefined && (
        <div className="md:text-base text-sm">
          <div className="mt-4 font-bold underline">Prizes</div>
          <ul className="list-decimal list-inside">
            {props.prizes.map((prize, idx) => (
              <li key={idx}>{prize}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-2">
        <button
          className="font-bold bg-green-200 hover:bg-green-300 border border-green-800 text-green-900 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm mr-2"
          onClick={props.onEditClick}
        >
          Edit Challenge
        </button>
        <button
          className="font-bold text-red-800 bg-red-100 hover:bg-red-200 border border-red-400 rounded-lg md:p-3 p-1 px-2 md:text-base text-sm"
          onClick={props.onDeleteClick}
        >
          Delete Challenge
        </button>
      </div>
    </div>
  );
}

export default ChallengeCard;
