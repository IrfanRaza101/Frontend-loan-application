import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  DollarSign,
  Home,
  Car,
  CreditCard,
  GraduationCap,
  Users,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  Quote,
  FileText
} from 'lucide-react';
import Footer from '@/components/Footer';

// Custom hook for counting animation
const useCountAnimation = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const rafRef = useRef<number>();

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration, start]);

  return count;
};

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Animated values for statistics
  const animatedLoansValue = useCountAnimation(hasAnimated ? 2.5 : 0, 2500);
  const animatedCustomersValue = useCountAnimation(hasAnimated ? 50 : 0, 2000);
  const animatedHoursValue = useCountAnimation(hasAnimated ? 24 : 0, 1500);
  const animatedRatingValue = useCountAnimation(hasAnimated ? 49 : 0, 2000);

  // Intersection Observer to trigger animation when stats come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const features = [
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your personal and financial information is protected with bank-level security.",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Quick Approval",
      description: "Get approved in minutes with our streamlined application process.",
      color: "text-yellow-600"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Our dedicated team is here to guide you through every step of the process.",
      color: "text-green-600"
    },
    {
      icon: DollarSign,
      title: "Competitive Rates",
      description: "We offer some of the most competitive interest rates in the market.",
      color: "text-purple-600"
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Apply anytime, anywhere with our round-the-clock online platform.",
      color: "text-red-600"
    },
    {
      icon: CheckCircle,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprise charges or hidden costs.",
      color: "text-indigo-600"
    }
  ];

  const loanTypes = [
    {
      icon: Home,
      title: "Home Loans",
      description: "Make your dream home a reality with our flexible mortgage options.",
      amount: "Up to $500K",
      rate: "2.99% APR",
      color: "bg-blue-500",
      type: "home"
    },
    {
      icon: Car,
      title: "Auto Loans",
      description: "Drive away with competitive rates on new and used vehicles.",
      amount: "Up to $75K",
      rate: "3.99% APR",
      color: "bg-green-500",
      type: "auto"
    },
    {
      icon: CreditCard,
      title: "Personal Loans",
      description: "Flexible personal financing for any life event or expense.",
      amount: "Up to $50K",
      rate: "6.99% APR",
      color: "bg-purple-500",
      type: "personal"
    },
    {
      icon: GraduationCap,
      title: "Education Loans",
      description: "Invest in your future with our education financing options.",
      amount: "Up to $100K",
      rate: "3.99% APR",
      color: "bg-orange-500",
      type: "education"
    }
  ];

  const stats = [
    { label: "Loans Approved", value: "50K+", icon: CheckCircle },
    { label: "Total Funded", value: "$2.5B+", icon: DollarSign },
    { label: "Average Approval", value: "24hrs", icon: Clock },
    { label: "Customer Rating", value: "4.9/5", icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "LoanPortal helped me secure funding for my business expansion. The process was incredibly smooth and the team was very supportive throughout.",
      rating: 5,
      image: "SJ"
    },
    {
      name: "Michael Chen",
      role: "First-time Home Buyer",
      content: "As a first-time buyer, I was nervous about the mortgage process. LoanPortal made it simple and stress-free. Highly recommended!",
      rating: 5,
      image: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Graduate Student",
      content: "The education loan process was straightforward and the rates were competitive. I'm grateful for their support in my academic journey.",
      rating: 5,
      image: "ER"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Apply Online",
      description: "Fill out our simple online application in just 5 minutes",
      icon: FileText
    },
    {
      step: "2",
      title: "Get Approved",
      description: "Receive instant pre-approval and loan terms within 24 hours",
      icon: CheckCircle
    },
    {
      step: "3",
      title: "Receive Funds",
      description: "Get your funds deposited directly to your account",
      icon: DollarSign
    }
  ];

  const faqs = [
    {
      question: "What documents do I need to apply?",
      answer: "You'll need a valid ID, proof of income (pay stubs or tax returns), bank statements, and employment verification. Additional documents may be required based on the loan type."
    },
    {
      question: "How long does the approval process take?",
      answer: "Most applications receive a decision within 24-48 hours. Complex cases may take up to 5 business days. You'll be notified immediately once a decision is made."
    },
    {
      question: "What credit score do I need?",
      answer: "We work with borrowers across the credit spectrum. While a higher credit score may qualify you for better rates, we have options for those with fair or poor credit as well."
    },
    {
      question: "Can I pay off my loan early?",
      answer: "Yes! We encourage early repayment and don't charge any prepayment penalties. You can save on interest by paying off your loan ahead of schedule."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees, ever. We believe in transparent pricing. All fees and costs are clearly outlined in your loan agreement before you sign."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trusted by 50,000+ customers
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 bounce-in text-gradient">
              Get Your Dream Loan <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent neon-glow">In Minutes</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Fast, secure, and transparent lending solutions for all your financial needs. 
              From home loans to personal financing, we've got you covered.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link to="/apply">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Learn More
              </Button>
            </div>
            
            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  ${animatedLoansValue.toFixed(1)}B+
                </div>
                <div className="text-sm text-muted-foreground">Loans Approved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {animatedCustomersValue}K+
                </div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {animatedHoursValue}hrs
                </div>
                <div className="text-sm text-muted-foreground">Quick Approval</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {(animatedRatingValue / 10).toFixed(1)}★
                </div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the best lending experience with cutting-edge technology and personalized service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your loan approved in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Loan Types</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Loan Type
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer various loan types to meet your financial needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {loanTypes.map((loan, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <loan.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{loan.title}</h3>
                  <p className="text-muted-foreground mb-4">{loan.description}</p>
                  <p className="text-2xl font-bold text-primary">{loan.rate}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Read what our satisfied customers have to say about our services
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Apply for your loan today and get approved in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/apply">Apply Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;