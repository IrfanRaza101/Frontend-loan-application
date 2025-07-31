import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Star, Sparkles, HeadphonesIcon, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL_PRODUCTION || import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/contact/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert('Failed to send message: ' + result.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Financial District", "New York, NY 10004", "United States"],
      color: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543", "Mon-Fri: 9AM-6PM EST"],
      color: "text-green-600"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@loanportal.com", "info@loanportal.com", "Response within 24 hours"],
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 particle-bg morphing-bg">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 zoom-in glow-pulse">
              <MessageCircle className="w-4 h-4" />
              Get in Touch
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bounce-in text-gradient">
              Contact Us
              <Sparkles className="inline-block ml-2 w-8 h-8 text-yellow-500 neon-glow" />
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto slide-in-left">
              Have questions? We're here to help. Reach out to our team for personalized assistance with your loan application.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 stagger-animation">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="floating-card glass-card magnetic-hover hover-lift" style={{ '--stagger-delay': 1 } as React.CSSProperties}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold bounce-in text-gradient">Send us a Message</CardTitle>
                <CardDescription className="slide-in-left">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 zoom-in" style={{ '--stagger-delay': 2 } as React.CSSProperties}>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="magnetic-hover"
                      />
                    </div>
                    <div className="space-y-2 zoom-in" style={{ '--stagger-delay': 3 } as React.CSSProperties}>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="magnetic-hover"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 zoom-in" style={{ '--stagger-delay': 4 } as React.CSSProperties}>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="magnetic-hover"
                    />
                  </div>
                  
                  <div className="space-y-2 zoom-in" style={{ '--stagger-delay': 5 } as React.CSSProperties}>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="magnetic-hover"
                    />
                  </div>
                  
                  <div className="space-y-2 zoom-in" style={{ '--stagger-delay': 6 } as React.CSSProperties}>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger className="magnetic-hover">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="loan-application">Loan Application</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 zoom-in" style={{ '--stagger-delay': 7 } as React.CSSProperties}>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      required
                      className="magnetic-hover"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full liquid-button magnetic-hover subtle-glow"
                    disabled={isSubmitting}
                    style={{ '--stagger-delay': 8 } as React.CSSProperties}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                  
                  {isSubmitted && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-800 font-medium">
                          Message sent successfully! We'll get back to you within 24 hours.
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* FAQ Section */}
              <Card className="border-0 shadow-lg glass-card floating-card magnetic-hover">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 bounce-in neon-glow">
                    <HeadphonesIcon className="w-5 h-5 text-primary zoom-in glow-pulse" />
                    Quick Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg slide-in-left">
                    <h4 className="font-semibold mb-2 neon-glow">Need Immediate Help?</h4>
                    <p className="text-sm text-muted-foreground mb-3 typing-effect">
                      For urgent loan-related questions, call our hotline:
                    </p>
                    <p className="font-bold text-primary">+1 (555) 123-4567</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg slide-in-right">
                    <h4 className="font-semibold mb-2 neon-glow">Live Chat Available</h4>
                    <p className="text-sm text-muted-foreground mb-3 typing-effect">
                      Chat with our support team Monday to Friday, 9 AM - 6 PM EST
                    </p>
                    <Button variant="outline" size="sm" className="glass-card magnetic-hover">
                      Start Live Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="border-0 shadow-lg glass-card floating-card magnetic-hover">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 bounce-in neon-glow">
                    <Clock className="w-5 h-5 text-primary zoom-in glow-pulse" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 stagger-animation">
                    {[
                      { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
                      { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
                      { day: "Sunday", hours: "Closed" }
                    ].map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 slide-in-left">
                        <span className="font-medium">{schedule.day}</span>
                        <span className="text-muted-foreground">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto glass-card floating-card p-8 rounded-2xl magnetic-hover">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bounce-in neon-glow">
              Ready to Apply for a Loan?
            </h2>
            <p className="text-primary-foreground/80 mb-8 slide-in-left typing-effect">
              Don't wait! Start your loan application today and get approved in as little as 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-animation">
              <Button size="lg" variant="secondary" className="liquid-button magnetic-hover" asChild>
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary glass-card" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <div className="container mx-auto px-4 py-16">
        <Card className="w-full mx-auto floating-card glass-card magnetic-hover hover-lift shadow-xl" style={{ '--stagger-delay': 2 } as React.CSSProperties}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bounce-in text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Get in Touch
            </CardTitle>
            <CardDescription className="slide-in-left text-lg">
              Multiple ways to reach our dedicated team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="transform hover:scale-105 transition-transform flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm magnetic-hover zoom-in" style={{ '--stagger-delay': 3 } as React.CSSProperties}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center glow-pulse shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-blue-900">Phone</h3>
                  <p className="text-blue-700 text-sm font-medium">+1 (555) 123-4567</p>
                  <p className="text-blue-600 text-xs">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
              
              <div className="transform hover:scale-105 transition-transform flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 shadow-sm magnetic-hover zoom-in" style={{ '--stagger-delay': 4 } as React.CSSProperties}>
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center glow-pulse shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-green-900">Email</h3>
                  <p className="text-green-700 text-sm font-medium">support@loanportal.com</p>
                  <p className="text-green-600 text-xs">24-hour response time</p>
                </div>
              </div>
              
              <div className="transform hover:scale-105 transition-transform flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 shadow-sm magnetic-hover zoom-in" style={{ '--stagger-delay': 5 } as React.CSSProperties}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center glow-pulse shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-purple-900">Office</h3>
                  <p className="text-purple-700 text-sm font-medium">123 Financial Street</p>
                  <p className="text-purple-600 text-xs">New York, NY 10001</p>
                </div>
              </div>
              
              <div className="transform hover:scale-105 transition-transform flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 shadow-sm magnetic-hover zoom-in" style={{ '--stagger-delay': 6 } as React.CSSProperties}>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center glow-pulse shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-orange-900">Hours</h3>
                  <p className="text-orange-700 text-sm font-medium">Mon-Fri: 9AM-6PM</p>
                  <p className="text-orange-600 text-xs">Sat: 10AM-4PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;