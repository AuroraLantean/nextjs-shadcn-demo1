"use server"

import { revalidatePath } from "next/cache";
import Box, { BoxT } from "../models/box.model";
import { connectToDB } from "../mongoose"

export async function findAll(limit = 10): Promise<BoxT[]> {
  console.log("findAll()...");
  connectToDB();
  try {
    const boxesM = await Box.find({}).limit(limit).exec();
    //const boxes = await Box.where("age").gt(12).where("title").equals("john").limit(10).select("age title");
    console.log("findAll() is successful. boxes:", boxesM);
    const boxes = boxesM.map(box => (JSON.parse(JSON.stringify(box)) as BoxT))
    return boxes;
  } catch (error: any) {
    console.log('box.actions.ts: findAll() failed:', error);
    throw new Error(`findAll: ${error.message}`);
  }
}
export async function findOne(id: string) {
  console.log("findOne()...");
  connectToDB();
  try {
    /*if (path === '/profile/edit') {
      revalidatePath(path);
    }*/
    const found = await Box.findOne({ id }).exec();
    console.log("findOne() is successful. foundBox:", found);
    return JSON.parse(JSON.stringify(found)) as BoxT;
  } catch (error: any) {
    console.log('box.actions.ts: findOne() failed:', error);
    throw new Error(`findOne: ${error.message}`);
  }
}
export async function addOne(box: Partial<BoxT>) {
  console.log("addOne()...");
  connectToDB();
  try {
    const boxNew: BoxT = await Box.create({ ...box });
    /*if (path === '/profile/edit') {
      revalidatePath(path);
    }*/
    console.log("addOneBox() is successful. boxNew:", boxNew);
    return boxNew;
  } catch (error: any) {
    console.log('box.actions.ts: addOneBox() failed:', error);
    throw new Error(`addOne: ${error.message}`);
  }
}

export async function addOrUpdateOne(box: Partial<BoxT>) {
  console.log("addOrUpdateOne()...");
  connectToDB();
  //typo err in the new box attributes will pass!
  try {
    const result = await Box.findOneAndUpdate(
      { id: box.id },
      { ...box },
      { upsert: true, returnOriginal: false },//to insert if it does not exist, or update if it exist! returnOriginal true to return old value
    );
    //https://nextjs.org/docs/app/api-reference/functions/revalidatePath ... to purge cached data on-demand for a specific path.
    /*if (path === '/profile/edit') {
      revalidatePath(path);
    }*/
    console.log("addOrUpdateOne() is successful. result:", result);
    return JSON.parse(JSON.stringify(result)) as BoxT;
  } catch (error: any) {
    console.log('box.actions.ts: addOrUpdateOne() failed:', error);
    throw new Error('addOrUpdateOne: ${error.message}');
  }
}

export async function deleteOne(id: string) {
  console.log("deleteOne()...");
  connectToDB();
  try {
    const result = await Box.deleteOne({ id });
    //https://nextjs.org/docs/app/api-reference/functions/revalidatePath ... to purge cached data on-demand for a specific path.
    /*if (path === '/profile/edit') {
      revalidatePath(path);
    }*/
    console.log("deleteOne() is successful. result:", result);
    return result;
  } catch (error: any) {
    console.log('box.actions.ts: deleteOne() failed:', error);
    throw new Error('deleteOne: ${error.message}');
  }
}

export async function deleteAll() {
  console.log("deleteAll()...");
  connectToDB();
  try {
    const result = await Box.deleteMany({});
    //https://nextjs.org/docs/app/api-reference/functions/revalidatePath ... to purge cached data on-demand for a specific path.
    /*if (path === '/profile/edit') {
      revalidatePath(path);
    }*/
    console.log("deleteAll() is successful. result:", result);
    return result;
  } catch (error: any) {
    console.log('box.actions.ts: deleteAll() failed:', error);
    throw new Error('deleteAll: ${error.message}');
  }
}

/*
// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchBoxs({
  id,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  id: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of boxs to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter boxs.
    const query: FilterQuery<typeof Box> = {
      id: { $ne: id }, // Exclude the current box from the results.
    };

    // If the search string is not empty, add the $or operator to match either  or title fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { xyz: { $regex: regex } },
        { title: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched boxs based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const boxsQuery = Box.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of boxs that match the search criteria (without pagination).
    const totalBoxsCount = await Box.countDocuments(query);

    const boxs = await boxsQuery.exec();

    // Check if there are more boxs beyond the current page.
    const isNext = totalBoxsCount > skipAmount + boxs.length;

    return { boxs, isNext };
  } catch (error) {
    console.error("Error fetching boxs:", error);
    throw error;
  }
}
*/