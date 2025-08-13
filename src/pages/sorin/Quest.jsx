import { useParams, useNavigate } from "react-router-dom";
import QuestStepPicker from "../../components/feature/quest/QuestStepPicker";
import { getCafeById } from "../../api/cafe";   // 너희 api/cafe.js에 함수만 추가하면 됨
import { submitQuest } from "../../api/quest"; // 목업 제출

export default function Quest(){
  const { id } = useParams();
  const nav = useNavigate();
  const cafe = getCafeById(id); // mock에서 찾기

  if(!cafe) return <div>존재하지 않는 매장</div>;

  return (
    <div className="quest-container">
      <QuestStepPicker
        cafe={cafe}
        // seed 주면 같은 화면 재현 가능: seed={0|1|2|3}
        onDone={async (payload)=>{
          await submitQuest({ cafeId: id, ...payload });
          nav("/reward"); // 완료 후 보상/리워드로
        }}
      />
    </div>
  );
}

