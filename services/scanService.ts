import { ScanType, ScanFormData } from '@/types/scan';

export class ScanService {
  static async fetchScanTypes(token: string): Promise<ScanType[]> {
    const response = await fetch('/api/scantypes', {
      headers: { Authorization: token },
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch scan types');
    }

    return response.json();
  }

  static async createScan(
    token: string,
    scanData: ScanFormData & { precedence: number },
  ): Promise<void> {
    const response = await fetch('/api/scan/create', {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(scanData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg || 'Failed to create scan');
    }
  }

  static async updateScan(token: string, scanData: ScanType): Promise<void> {
    const response = await fetch('/api/scan/update', {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ scanData }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg || 'Failed to update scan');
    }
  }

  static async deleteScan(token: string, scanData: ScanType): Promise<void> {
    const response = await fetch('/api/scan/delete', {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ scanData }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg || 'Failed to delete scan');
    }
  }
}
