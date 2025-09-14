import { Card, ProgressBar } from 'react-bootstrap';

interface ModelCardProps {
  modelName: string;
  complexityDifference: number;
  energyEfficiencyDifference: number;
  percentageGain: number;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  modelName,
  complexityDifference,
  energyEfficiencyDifference,
  percentageGain
}) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="text-primary mb-3">{modelName}</Card.Title>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted">Complexity Reduction</span>
            <span className="small">{complexityDifference}%</span>
          </div>
          <ProgressBar 
            variant="success" 
            now={complexityDifference} 
            label={`${complexityDifference}%`}
          />
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted">Energy Efficiency</span>
            <span className="small">{(energyEfficiencyDifference * 100).toFixed(1)}%</span>
          </div>
          <ProgressBar 
            variant="info" 
            now={energyEfficiencyDifference * 100} 
            label={`${(energyEfficiencyDifference * 100).toFixed(1)}%`}
          />
        </div>

        <div className="mt-3 pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Performance Gain</span>
            <span className="h5 mb-0 text-success">+{percentageGain}%</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};