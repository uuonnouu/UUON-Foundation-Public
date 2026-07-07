
import { ethers } from 'ethers';

export interface BlockchainConfig {
  network: 'mainnet' | 'sepolia' | 'polygon';
  contractAddress?: string;
  privateKey?: string;
  infuraProjectId?: string;
}

export interface NFTMintData {
  name: string;
  description: string;
  imageUri: string;
  animationUri: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
}

export class CryptoService {
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private config: BlockchainConfig;

  constructor(config: BlockchainConfig) {
    this.config = config;
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      // For browser wallet integration (MetaMask)
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      } else if (this.config.infuraProjectId) {
        // For server-side operations
        const networkUrl = this.getNetworkUrl();
        this.provider = new ethers.JsonRpcProvider(networkUrl);
      }
    } catch (error) {
      console.error('Failed to initialize provider:', error);
    }
  }

  private getNetworkUrl(): string {
    const { network, infuraProjectId } = this.config;
    switch (network) {
      case 'mainnet':
        return `https://mainnet.infura.io/v3/${infuraProjectId}`;
      case 'sepolia':
        return `https://sepolia.infura.io/v3/${infuraProjectId}`;
      case 'polygon':
        return `https://polygon-mainnet.infura.io/v3/${infuraProjectId}`;
      default:
        return `https://sepolia.infura.io/v3/${infuraProjectId}`;
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await this.provider?.getSigner();
      this.signer = signer || null;
      
      return await signer?.getAddress() || null;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }

  async uploadToIPFS(file: Blob, fileName: string): Promise<string> {
    // This is a placeholder - you'll need to integrate with a real IPFS service
    // like Pinata, Infura IPFS, or NFT.Storage
    try {
      const formData = new FormData();
      formData.append('file', file, fileName);

      // Example using Pinata (you'll need to set up API keys)
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_PINATA_JWT_TOKEN`
        },
        body: formData
      });

      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      // Fallback to mock IPFS hash for development
      return `ipfs://QmMock${Date.now()}`;
    }
  }

  async uploadMetadataToIPFS(metadata: NFTMintData): Promise<string> {
    try {
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      return await this.uploadToIPFS(metadataBlob, 'metadata.json');
    } catch (error) {
      console.error('Metadata upload failed:', error);
      return `ipfs://QmMockMetadata${Date.now()}`;
    }
  }

  async mintNFT(tokenUri: string, recipient: string): Promise<string | null> {
    try {
      if (!this.signer || !this.config.contractAddress) {
        throw new Error('Signer or contract address not available');
      }

      // Basic ERC-721 contract ABI (mint function)
      const contractABI = [
        "function mint(address to, string memory uri) public returns (uint256)"
      ];

      const contract = new ethers.Contract(
        this.config.contractAddress,
        contractABI,
        this.signer
      );

      const transaction = await contract.mint(recipient, tokenUri);
      const receipt = await transaction.wait();
      
      return receipt.hash;
    } catch (error) {
      console.error('Minting failed:', error);
      return null;
    }
  }

  async getGasEstimate(): Promise<string> {
    try {
      if (!this.provider) return 'Unknown';
      
      const gasPrice = await this.provider.getFeeData();
      const estimatedGas = ethers.parseUnits('100000', 'wei'); // Rough estimate
      const cost = gasPrice.gasPrice ? gasPrice.gasPrice * estimatedGas : BigInt(0);
      
      return ethers.formatEther(cost);
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return 'Unknown';
    }
  }
}

// Global crypto service instance
let cryptoServiceInstance: CryptoService | null = null;

export const getCryptoService = (): CryptoService => {
  if (!cryptoServiceInstance) {
    const config: BlockchainConfig = {
      network: 'sepolia', // Start with testnet
      infuraProjectId: process.env.VITE_INFURA_PROJECT_ID,
      contractAddress: process.env.VITE_NFT_CONTRACT_ADDRESS
    };
    cryptoServiceInstance = new CryptoService(config);
  }
  return cryptoServiceInstance;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
