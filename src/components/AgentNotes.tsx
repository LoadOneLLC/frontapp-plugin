import { useFrontContext } from '../providers/frontContext';
import { Paragraph } from '@frontapp/ui-kit';

function AgentNotes() {
  const context = useFrontContext();

  return (
    <div className="App">
      <Paragraph>Load One LLC</Paragraph>
    </div>
  );
}

export default AgentNotes;
