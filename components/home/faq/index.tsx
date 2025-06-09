import FaqCore from './FaqCore';

interface Props {
  answeredQuestions: AnsweredQuestion[];
}

export default function HomeFaq({ answeredQuestions }: Props) {
  return (
    answeredQuestions.length != 0 && (
      <section
        style={{
          background: '#F2F3FF',
          position: 'relative',
        }}
      >
        <FaqCore fetchedFaqs={answeredQuestions}></FaqCore>
      </section>
    )
  );
}
