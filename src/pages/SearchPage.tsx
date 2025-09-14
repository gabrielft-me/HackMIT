import { fetchListOfLLMs } from '../api/fetchListOfLLMs';
import { InputBox } from '../components/InputBox'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { getOptimalModels } from '../api/claude';
import { useUserDataProvider } from '../providers/UserDataProvider';
import { ModelCard } from '../components/ModelCard';

interface OptimalLLM {
  'model-name': string;
  'complexity-difference': number;
  'energy-efficiency-difference': number;
  'percentage-gain': number;
}

// Function to process and validate LLM data
const processLLMData = (data: any[]): OptimalLLM[] => {
  if (!Array.isArray(data)) {
    console.error('Invalid data format: expected array');
    return [];
  }

  return data.map(item => ({
    'model-name': item['model-name'] || 'Unknown Model',
    'complexity-difference': Number(item['complexity-difference']) || 0,
    'energy-efficiency-difference': Number(item['energy-efficiency-difference']) || 0,
    'percentage-gain': Number(item['percentage-gain']) || 0
  }));
};

const SearchPage = () => {
  const [listOfOptimalLLMs, setListOfOptimalLLMs] = useState<OptimalLLM[]>([]);
  const { userProfile } = useUserDataProvider();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setIsLoading(true);
      setError(null);
      
      fetchListOfLLMs()
        .then(output => {
          if (!output) throw new Error('No data received from fetchListOfLLMs');
          console.log('Raw fetchListOfLLMs output:', output);
          return getOptimalModels(userProfile, output);
        })
        .then(output => {
          console.log('Raw getOptimalModels output:', output);
          if ('type' in output && output.type === 'text') {
            console.log('Text content to parse:', output.text);
            try {
              const parsedData = JSON.parse(output.text);
              console.log('Successfully parsed data:', parsedData);
              return processLLMData(parsedData["most-efficient-models"]);
            } catch (parseError) {
              console.error('JSON Parse Error:', parseError);
              console.error('Failed to parse text:', output.text);
              throw parseError;
            }
          }
          return [];
        })
        .then(output => setListOfOptimalLLMs(output))
        .catch(error => {
          console.error('Error processing LLMs:', error);
          setError('Failed to load model recommendations');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userProfile]);

  return (
    <div className="container-fluid py-4" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Container fluid className="text-center py-5 bg-light">
        <h1>Recommended AI Models</h1>
        <p className="lead">
          Compare and find the most suitable AI models tailored to your specific needs
        </p>
      </Container>
      {/* Top input box */}
      <div className="row mb-4 justify-content-center mt-4">
        <div className="col-12 col-md-8 col-lg-6">
          <InputBox />
        </div>
      </div>
      
      {/* Results Display */}
      <Container>
        {isLoading && (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        
        {!isLoading && !error && (
          <Row className="g-4">
            {listOfOptimalLLMs.map((model, index) => (
              <Col key={index} xs={12} md={6} lg={4}>
                <ModelCard
                  modelName={model['model-name']}
                  complexityDifference={model['complexity-difference']}
                  energyEfficiencyDifference={model['energy-efficiency-difference']}
                  percentageGain={model['percentage-gain']}
                />
              </Col>
            ))}
            
            {listOfOptimalLLMs.length === 0 && !isLoading && (
              <Col xs={12}>
                <div className="text-center py-5">
                  <h4 className="text-muted">No recommendations yet</h4>
                  <p>Enter your requirements above to get personalized AI model recommendations</p>
                </div>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  )
}

export default SearchPage