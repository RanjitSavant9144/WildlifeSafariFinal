import React, { useState } from 'react';
import axios from 'axios';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  responseTime?: number;
}

const TestConnection: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Auth Service', url: 'http://localhost:5001/api', status: 'pending', message: 'Not tested yet' },
    { name: 'Booking Service', url: 'http://localhost:5002/api', status: 'pending', message: 'Not tested yet' },
    { name: 'Admin Service', url: 'http://localhost:5003/api', status: 'pending', message: 'Not tested yet' }
  ]);
  const [testing, setTesting] = useState(false);

  const testService = async (service: ServiceStatus): Promise<ServiceStatus> => {
    const startTime = Date.now();
    try {
      // Try a simple health check or any endpoint that should respond
      const response = await axios.get(`${service.url}/health`, {
        timeout: 5000,
      });
      const responseTime = Date.now() - startTime;
      
      return {
        ...service,
        status: 'success',
        message: `Connected successfully! (${response.status} ${response.statusText})`,
        responseTime
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      if (error.code === 'ECONNABORTED') {
        return {
          ...service,
          status: 'error',
          message: 'Connection timeout - service not responding',
          responseTime
        };
      } else if (error.code === 'ERR_NETWORK') {
        return {
          ...service,
          status: 'error',
          message: 'Network error - service may not be running',
          responseTime
        };
      } else if (error.response) {
        // Server responded but with an error status
        return {
          ...service,
          status: 'success',
          message: `Server is running (${error.response.status} ${error.response.statusText})`,
          responseTime
        };
      } else {
        return {
          ...service,
          status: 'error',
          message: `Error: ${error.message}`,
          responseTime
        };
      }
    }
  };

  const testAllServices = async () => {
    setTesting(true);
    
    for (let i = 0; i < services.length; i++) {
      const result = await testService(services[i]);
      setServices(prev => {
        const updated = [...prev];
        updated[i] = result;
        return updated;
      });
    }
    
    setTesting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      default:
        return '○';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Backend Connectivity Test</h1>
        <p style={styles.description}>
          Test the connection between frontend and backend services
        </p>

        <button
          onClick={testAllServices}
          disabled={testing}
          style={{
            ...styles.button,
            ...(testing ? styles.buttonDisabled : {})
          }}
        >
          {testing ? 'Testing...' : 'Test All Services'}
        </button>

        <div style={styles.servicesContainer}>
          {services.map((service, index) => (
            <div key={index} style={styles.serviceCard}>
              <div style={styles.serviceHeader}>
                <span
                  style={{
                    ...styles.statusIcon,
                    color: getStatusColor(service.status)
                  }}
                >
                  {getStatusIcon(service.status)}
                </span>
                <h3 style={styles.serviceName}>{service.name}</h3>
              </div>
              
              <div style={styles.serviceDetails}>
                <p style={styles.url}><strong>URL:</strong> {service.url}</p>
                <p style={styles.message}>
                  <strong>Status:</strong> {service.message}
                </p>
                {service.responseTime !== undefined && (
                  <p style={styles.responseTime}>
                    <strong>Response Time:</strong> {service.responseTime}ms
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.instructions}>
          <h3>Instructions:</h3>
          <ol style={styles.instructionsList}>
            <li>Make sure your backend services are running</li>
            <li>Click "Test All Services" to check connectivity</li>
            <li>Green checkmark (✓) indicates successful connection</li>
            <li>Red cross (✗) indicates connection failure</li>
          </ol>
          
          <div style={styles.note}>
            <strong>Note:</strong> If all services show errors, make sure:
            <ul>
              <li>Backend servers are running on the correct ports</li>
              <li>CORS is configured properly on the backend</li>
              <li>No firewall is blocking the connections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  card: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#333',
  },
  description: {
    color: '#666',
    marginBottom: '30px',
  },
  button: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '30px',
    transition: 'background-color 0.3s',
  },
  buttonDisabled: {
    backgroundColor: '#9e9e9e',
    cursor: 'not-allowed',
  },
  servicesContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    marginBottom: '30px',
  },
  serviceCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    padding: '15px',
    backgroundColor: '#fafafa',
  },
  serviceHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statusIcon: {
    fontSize: '24px',
    marginRight: '10px',
    fontWeight: 'bold' as const,
  },
  serviceName: {
    fontSize: '18px',
    margin: 0,
    color: '#333',
  },
  serviceDetails: {
    paddingLeft: '34px',
  },
  url: {
    margin: '5px 0',
    color: '#555',
    fontSize: '14px',
  },
  message: {
    margin: '5px 0',
    color: '#555',
    fontSize: '14px',
  },
  responseTime: {
    margin: '5px 0',
    color: '#555',
    fontSize: '14px',
  },
  instructions: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f0f7ff',
    borderRadius: '5px',
    borderLeft: '4px solid #2196f3',
  },
  instructionsList: {
    marginLeft: '20px',
    color: '#555',
  },
  note: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#fff3cd',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#856404',
  },
};

export default TestConnection;
