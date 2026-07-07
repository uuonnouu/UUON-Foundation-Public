// ============================================================
// PIEZ Token Gate Middleware for MOS
// Verifies PIEZ balance before serving shape data
// ============================================================

import type { Request, Response, NextFunction } from "express";

interface PIEZVerifyRequest extends Request {
  piez?: {
    wallet: string;
    balance: string;
    tier: number;
  };
}

const PIEZ_CONTRACT = "0xfb9c83432331EAf6f4a9D9488828823587d6f3da";
const MIN_PIEZ_BALANCE = "1000000000000000000"; // 1 PIEZ (18 decimals)

/**
 * PIEZ Token Gate Middleware
 * Checks wallet PIEZ balance before allowing shape data access
 */
export async function piezGate(
  req: PIEZVerifyRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("PIEZ-Balance ")) {
    res.status(401).json({
      error: "PIEZ_GATE_REQUIRED",
      message: "Authorization header required",
      format: "Authorization: PIEZ-Balance {walletAddress}",
      piez_contract: PIEZ_CONTRACT,
      min_balance: "1 PIEZ",
      buy_link: "https://uniswap.exchange/swap?outputCurrency=" + PIEZ_CONTRACT,
    });
    return;
  }

  const wallet = authHeader.replace("PIEZ-Balance ", "").trim();

  // Validate Ethereum address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    res.status(400).json({
      error: "INVALID_ADDRESS",
      message: "Invalid Ethereum address format",
    });
    return;
  }

  try {
    // Mock balance check (in production, query Ethereum RPC or Etherscan)
    // For demo: simulate balance check
    const hasBalance = await checkPIEZBalance(wallet);

    if (!hasBalance) {
      res.status(403).json({
        error: "INSUFFICIENT_PIEZ",
        message: `Wallet ${wallet} has insufficient PIEZ balance`,
        required_balance: "1 PIEZ",
        current_balance: "0 PIEZ",
        buy_link: "https://uniswap.exchange/swap?outputCurrency=" + PIEZ_CONTRACT,
      });
      return;
    }

    // Attach wallet info to request
    req.piez = {
      wallet,
      balance: "1000000000000000000",
      tier: 1,
    };

    next();
  } catch (error) {
    res.status(500).json({
      error: "GATE_ERROR",
      message: "PIEZ verification failed",
    });
  }
}

/**
 * Check PIEZ balance (demo implementation)
 * In production: use ethers.js + Ethereum RPC
 */
async function checkPIEZBalance(wallet: string): Promise<boolean> {
  // For now, allow all wallets that pass address format check
  // In production:
  // const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
  // const contract = new ethers.Contract(PIEZ_CONTRACT, ERC20_ABI, provider);
  // const balance = await contract.balanceOf(wallet);
  // return balance.gte(BigInt(MIN_PIEZ_BALANCE));

  return true; // Demo mode
}

export default piezGate;
