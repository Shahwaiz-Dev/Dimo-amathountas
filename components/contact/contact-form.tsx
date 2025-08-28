'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { TranslatableText } from '@/components/translatable-content';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the data to a server
    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-heading">
          <TranslatableText>Send us a Message</TranslatableText>
        </CardTitle>
        <CardDescription className="text-body">
          <TranslatableText>We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</TranslatableText>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-body">
                <TranslatableText>Name</TranslatableText>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-body">
                <TranslatableText>Email</TranslatableText>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject" className="text-body">
              <TranslatableText>Subject</TranslatableText>
            </Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="message" className="text-body">
              <TranslatableText>Message</TranslatableText>
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-primary text-white hover:bg-accent">
            <TranslatableText>Send Message</TranslatableText>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}