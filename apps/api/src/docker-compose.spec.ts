import fs from 'fs';
import path from 'path';
import { parseComposeServices, readComposeServices } from './utils/docker-compose';

describe('docker-compose.yml', () => {
  it('includes postgres and redis services', () => {
    const filePath = path.join(__dirname, '..', '..', '..', 'docker-compose.yml');
    const content = fs.readFileSync(filePath, 'utf8');
    const services = parseComposeServices(content);

    expect(services).toEqual(expect.arrayContaining(['postgres', 'redis']));
  });

  it('parses services from mocked content', () => {
    const mockContent = [
      'services:',
      '  postgres:',
      '    image: postgres:15',
    ].join('\n');

    const spy = jest.spyOn(fs, 'readFileSync').mockReturnValue(mockContent as unknown as string);
    const services = readComposeServices('/tmp/docker-compose.yml');

    expect(services).toEqual(['postgres']);
    spy.mockRestore();
  });
});
