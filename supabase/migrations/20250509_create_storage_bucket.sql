
-- Create a storage bucket for bill receipts
INSERT INTO storage.buckets (id, name, public) VALUES ('bill-receipts', 'Bill Receipts', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" 
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'bill-receipts');

-- Allow users to view their own files
CREATE POLICY "Users can view their own files" 
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'bill-receipts' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own files
CREATE POLICY "Users can update their own files" 
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'bill-receipts' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files" 
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'bill-receipts' AND (storage.foldername(name))[1] = auth.uid()::text);
