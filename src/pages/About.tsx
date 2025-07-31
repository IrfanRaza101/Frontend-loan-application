import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Footer from "@/components/Footer";
import { 
  Users, 
  Award, 
  TrendingUp, 
  Shield, 
  Heart, 
  Target,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Star,
  Building,
  Sparkles
} from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "50K+", color: "text-blue-600" },
    { icon: DollarSign, label: "Loans Approved", value: "$2.5B+", color: "text-slate-600" },
    { icon: Award, label: "Years Experience", value: "15+", color: "text-gray-600" },
    { icon: TrendingUp, label: "Success Rate", value: "98%", color: "text-blue-600" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your financial information is protected with bank-level security and encryption."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize your needs and provide personalized loan solutions for your unique situation."
    },
    {
      icon: Target,
      title: "Transparency",
      description: "No hidden fees, clear terms, and honest communication throughout your loan journey."
    },
    {
      icon: Clock,
      title: "Speed & Efficiency",
      description: "Quick approval process with most loans approved within 24-48 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background particle-bg morphing-bg">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-600">
            <Badge variant="outline" className="mb-4 text-primary border-primary zoom-in glow-pulse">
              <Sparkles className="h-3 w-3 mr-1 bounce-in" />
              About Irfan Loans
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 bounce-in text-gradient">
              Empowering Your{' '}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent neon-glow">
                Financial Journey
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto slide-in-left">
              For over a decade, we've been helping individuals and businesses achieve their dreams 
              through innovative lending solutions and exceptional customer service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-animation">
              <Button size="lg" className="liquid-button magnetic-hover" asChild>
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button variant="outline" size="lg" className="glass-card magnetic-hover" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 border-y border-slate-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-600">
            <Badge variant="outline" className="mb-4 text-slate-600 border-slate-300 zoom-in">
              <TrendingUp className="h-3 w-3 mr-1" />
              Our Achievements
            </Badge>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-3">
              Proven Track Record
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">
              Years of excellence in financial services
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:border-slate-300/70 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1"
                style={{ '--stagger-delay': index } as React.CSSProperties}
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200/50 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  
                  {/* Value */}
                  <div className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm font-medium text-slate-600 leading-tight">
                    {stat.label}
                  </div>
                </div>
                
                {/* Subtle bottom accent */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="glass-card floating-card p-8 rounded-2xl magnetic-hover">
              <Badge variant="outline" className="mb-4 zoom-in">Our Mission</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bounce-in neon-glow">
                Making Loans Accessible to Everyone
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed slide-in-left">
                Our mission is to democratize access to financial services by providing 
                fast, transparent, and affordable loan solutions. We believe everyone 
                deserves the opportunity to achieve their financial goals.
              </p>
              <div className="space-y-4 stagger-animation">
                {[
                  "Transparent pricing with no hidden fees",
                  "Quick approval process within 24-48 hours",
                  "Personalized loan solutions for every need",
                  "24/7 customer support and guidance"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 slide-in-right">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 zoom-in glow-pulse" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-slate-600 p-8 text-white glass-card floating-card magnetic-hover">
                <div className="h-full flex flex-col justify-center">
                  <Globe className="w-16 h-16 mb-6 opacity-80 zoom-in glow-pulse" />
                  <h3 className="text-2xl font-bold mb-4 bounce-in neon-glow">Our Vision</h3>
                  <p className="text-blue-100 leading-relaxed slide-in-left">
                    To become the world's most trusted and innovative financial platform, 
                    empowering millions of people to achieve their dreams through accessible 
                    and responsible lending.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-600">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 bounce-in text-gradient">
              Our Core Values
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto slide-in-left">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg bg-card/50 backdrop-blur-sm floating-card glass-card magnetic-hover hover-lift"
                style={{ '--stagger-delay': index } as React.CSSProperties}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto floating-card">
                    <value.icon className="h-6 w-6 md:h-8 md:w-8 text-primary zoom-in" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 text-center bounce-in">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-center slide-in-left">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto glass-card floating-card p-8 rounded-2xl magnetic-hover">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bounce-in neon-glow">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 mb-8 slide-in-left">
              Join thousands of satisfied customers who have achieved their financial goals with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-animation">
              <Button size="lg" variant="secondary" className="liquid-button magnetic-hover" asChild>
                <Link to="/apply">Apply for Loan</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary glass-card" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;