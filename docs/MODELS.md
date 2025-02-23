# Models
Please take note of the structure that new database models follow!

## Locations
1. Backend type definitions & their Mongo models live in the `src/backend/app/db/models` folder.
2. Frontend type definitions live in `shared/models`. This is so we can convert to them when returning from the API.

## Example
```TS
/* src/shared/models/Example.ts */
// notice here we use normal TypeScript types

interface ExampleOwner {
  username: string;
  profilePictureURL?: string;
}

export interface Example {
  id: string;
  name: string;
  tags: string[];
  owner: ExampleOwner;
}
```

```TS
/* src/backend/app/db/models/Example.ts */
import { Schema, model, Types } from 'mongoose';

// we follow C#'s standard of prefixing interfaces with a capital I
export interface IExample {
  name: string;
  tags: string[]
  owner: Types.ObjectId;
}

const ExampleSchema = new Schema<IExample>({
  // notice we don't define "id" or "_id", as mongo does that for us
  // additionally, we don't use normal typescript types, these are specially defined by Mongoose
  name: String, // normal string
  tags: [String], // array of strings
  owner: { type: Schema.Types.ObjectId, ref: 'User' }, // foreign key to the "User" model
});

// export the model for CRUD operations in services and routes, take note of naming scheme
export const Example = model<IExample>('Example', ExampleSchema);
```