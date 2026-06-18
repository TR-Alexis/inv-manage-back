import { Request, Response} from "express";
import { PrismaClient } from '../../generated/prisma';
import { SalesSummary, ExpenseByCategory, ExpenseSummary } from '../../generated/prisma/browser';

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const popularProducts = await prisma.products.findMany({
            take: 15,
            orderBy: {
                stockQuantity: "desc",
            },
        });
        const salesSummary = await prisma.salesSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc"
            },
        });
        const purchasesSummary = await prisma.purchaseSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc"
            },
        });
        const expenseSummary = await prisma.expenseSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc"
            },
        });
        const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
            take: 5,
            orderBy: {
                date: "desc"
            },
        });
        const expenseByCategory = expenseByCategorySummaryRaw.map(
            (item: ExpenseByCategory) => ({
                ...item, amount: item.amount.toString()
            })
        );

        res.json({
            popularProducts,
            salesSummary,
            purchasesSummary,
            expenseSummary,
            expenseByCategory
        })

    } catch (error) {
        res.status(500).json({ message: "Error retrieving dashboard metrics" })
    }
}