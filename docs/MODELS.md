# Models
Please take note of the structure that new database models follow!

## Locations
1. Mongo definitions live in the `src/backend/app/db/models` folder.
2. Minimum viable type definitions live in `shared/models`.

## Example
```TS
/* src/shared/models/Example.ts */
// notice here we use normal TypeScript types
export interface Example {
  name: string;
  tags: string[];
}
```

```TS
/* src/backend/app/db/models/Example.ts */
import { Schema, model, Types } from 'mongoose';
import { Example as SharedExample } from '../../../../shared/models/Example';

// by extending the SharedExample, we enforce accuracy in the shared type so the front end will know what to expect
// additionally, we follow C#'s standard of prefixing interfaces with a capital I
export interface IExample extends SharedExample {
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